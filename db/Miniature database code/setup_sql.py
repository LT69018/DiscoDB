import time
import mysql.connector
from mysql.connector import Error
from getpass import getpass
from string import punctuation
from process_data import get_artist_info, get_all_release_info


def connect_to_server(host_name, username):
    connection = None

    try:
        connection = mysql.connector.connect(host=host_name, user=username, password=getpass())
        print("Server connection successful!")
    except Error as error:
        print("Error connecting to the SQL server:", error)

    return connection


def connect_to_db(host_name, username, db_name):
    connection = None

    try:
        connection = mysql.connector.connect(host=host_name, user=username, password=getpass(), database=db_name)
        print("Database connection successful!")
    except Error as error:
        print("Error connecting to the database:", error)

    return connection


def create_database(cursor):
    try:
        cursor.execute("CREATE DATABASE IF NOT EXISTS discodb")
        print("Database created successfully!")
    except Error as error:
        print("Error creating database:", error)


def create_artist_tables(connection):
    create_artists_table = """
            CREATE TABLE IF NOT EXISTS artists (
                artist_id   INT,
                artist_name VARCHAR(255) NOT NULL,
                real_name   VARCHAR(255),
                PRIMARY KEY (artist_id)
                );
                """
                
    create_name_variations_table = """
            CREATE TABLE IF NOT EXISTS name_variations (
                artist_id       INT,
                name_variation  VARCHAR(255),
                PRIMARY KEY (artist_id, name_variation),
                FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
                );
                """

    create_artist_aliases_table = """
            CREATE TABLE IF NOT EXISTS artist_aliases (
                artist_id           INT,
                artist_alias_id     INT,
                PRIMARY KEY (artist_id, artist_alias_id),
                FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
                FOREIGN KEY (artist_alias_id) REFERENCES artists(artist_id)
                );
                """

    create_band_membership_table = """
            CREATE TABLE IF NOT EXISTS band_membership (
                member_id   INT,
                band_id     INT,
                PRIMARY KEY (member_id, band_id),
                FOREIGN KEY (member_id) REFERENCES artists(artist_id),
                FOREIGN KEY (band_id) REFERENCES artists(artist_id)
                );
                """

    table_creation_queries = [create_artists_table, create_name_variations_table, create_artist_aliases_table,
                              create_band_membership_table]
    for query in table_creation_queries:
        execute_and_commit(connection, query)


def process_artist_data(artist_list):

    # Process the data to enter into the artist tables
    # separate the data into appropriate groups
    artists_to_insert = []
    name_vars_to_insert = []
    all_aliases = []
    memberships_to_insert = []
    for artist in artist_list:
        if artist.real_name:
            artists_to_insert.append((artist.artist_id, artist.name, artist.real_name))

            # If the artist's real name is different from their main name,
            # then add their real name to the name_variations table
            if artist.real_name != artist.name:
                name_vars_to_insert.append((artist.artist_id, artist.real_name))
        else:
            artists_to_insert.append((artist.artist_id, artist.name, None))

        for name_var in artist.name_variations:
            name_vars_to_insert.append((artist.artist_id, name_var))

        for alias in artist.aliases:
            all_aliases.append((artist.artist_id, alias[0]))

        for group in artist.groups:
            # This will allow lookup by artist name to find what band(s) they are in
            memberships_to_insert.append((artist.artist_id, group[0]))

        for member in artist.members:
            # This will allow lookup by band name to find its members
            memberships_to_insert.append((artist.artist_id, member[0]))

    # Remove invalid aliases
    # (aliases that point to artists that are not in artists_list)
    
    # Construct a dictionary of artist ids to allow for non-sequential lookup
    artist_ids = {}
    for artist in artist_list:
        artist_ids[artist.artist_id] = artist.artist_id

    # Construct a list of invalid aliases
    not_found_aliases = []
    for alias in all_aliases:
        if not artist_ids.get(alias[1]):
            not_found_aliases.append(alias)

    # Construct a dictionary of all aliases to allow for non-sequential lookup
    all_aliases_dict = {}
    for alias in all_aliases:
        all_aliases_dict[alias] = alias

    # Remove invalid aliases from all_aliases_dict
    for alias in not_found_aliases:
        all_aliases_dict.pop(alias)

    # Construct a new list of all valid aliases
    aliases_to_insert = []
    for alias in all_aliases_dict:
        aliases_to_insert.append(alias)

    return artists_to_insert, name_vars_to_insert, aliases_to_insert, memberships_to_insert


def insert_artist_data(artists_to_insert, name_vars_to_insert, aliases_to_insert, memberships_to_insert):
    insert_artists_query = """
                INSERT INTO artists (artist_id, artist_name, real_name) 
                VALUES (%s, %s, %s)"""
    insert_name_vars_query = """
                INSERT IGNORE INTO name_variations (artist_id, name_variation) 
                VALUES (%s, %s)"""
    insert_aliases_query = """
                INSERT INTO artist_aliases (artist_id, artist_alias_id) 
                VALUES (%s, %s)"""
    insert_band_membership_query = """
                INSERT IGNORE INTO band_membership (member_id, band_id) 
                VALUES (%s, %s)"""

    table_insertion_queries = {insert_artists_query: artists_to_insert,
                               insert_name_vars_query: name_vars_to_insert,
                               insert_aliases_query: aliases_to_insert,
                               insert_band_membership_query: memberships_to_insert}

    for query in table_insertion_queries.keys():
        execute_many_and_commit(connection, query, table_insertion_queries[query])


def create_album_tables(connection):
    create_albums_table = """
            CREATE TABLE IF NOT EXISTS albums (
                album_id        INT,
                album_title     VARCHAR(2048) NOT NULL DEFAULT 'Untitled',
                release_date    VARCHAR(16) NOT NULL,
                notes           LONGTEXT,
                num_songs       INT DEFAULT 0,
                PRIMARY KEY (album_id)
                );
                """

    create_songs_table = """
            CREATE TABLE IF NOT EXISTS songs (
                song_id         INT AUTO_INCREMENT,
                album_id        INT,
                song_title      VARCHAR(2048) NOT NULL DEFAULT 'Untitled',
                position        VARCHAR(255),
                song_duration   VARCHAR(32),
                PRIMARY KEY (song_id),
                FOREIGN KEY (album_id) REFERENCES albums(album_id)
                );
                """

    create_artist_song_credits_table = """
            CREATE TABLE IF NOT EXISTS artist_song_credits (
                artist_id           INT,
                song_id             INT,
                artist_song_role    VARCHAR(1024),
                is_primary_artist   INT DEFAULT 0,  
                PRIMARY KEY (artist_id, song_id),
                FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
                FOREIGN KEY (song_id) REFERENCES songs(song_id),
                CHECK(is_primary_artist IN (0, 1))
                );
                """

    create_artist_album_credits_table = """
            CREATE TABLE IF NOT EXISTS artist_album_credits (
                artist_id           INT,
                album_id            INT,
                artist_album_role   VARCHAR(1024),
                is_primary_artist   INT DEFAULT 0,  
                PRIMARY KEY (artist_id, album_id),
                FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
                FOREIGN KEY (album_id) REFERENCES albums(album_id),
                CHECK(is_primary_artist IN (0, 1))
                );
                """

    create_genres_table = """
            CREATE TABLE IF NOT EXISTS genres (
                album_id    INT,
                genre       VARCHAR(32),
                PRIMARY KEY (album_id, genre),
                FOREIGN KEY (album_id) REFERENCES albums(album_id)
                );
                """

    create_videos_table = """
            CREATE TABLE IF NOT EXISTS videos (
                album_id            INT,
                src                 VARCHAR(64),
                video_title         VARCHAR(255),
                video_duration      VARCHAR(32),
                PRIMARY KEY (album_id, src),
                FOREIGN KEY (album_id) REFERENCES albums(album_id)
                );
                """

    table_creation_queries = [create_albums_table, create_songs_table, create_artist_song_credits_table, create_artist_album_credits_table, create_genres_table,
                              create_videos_table]
    for query in table_creation_queries:
        execute_and_commit(connection, query)


def execute_and_commit(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query, multi=True)
        connection.commit()
        print("Query executed successfully!")
        print("Number of rows affected by statement '{}': \n\t{}".format(query, cursor.rowcount))
    except Error as error:
        print("Error executing query:", error, "\nQuery with error:", query)


def execute_many_and_commit(connection, query, vals):
    cursor = connection.cursor()
    try:
        cursor.executemany(query, vals)
        connection.commit()
        print("Queries executed successfully!")
        print("Number of rows affected by statement '{}': \n\t{}".format(query, cursor.rowcount))
    except Error as error:
        print("Error executing queries:", error, "\nQuery with error:", query)


def generate_replace_statements(search_field):
    replace_string = "REPLACE({}, '{}', '')".format(search_field, punctuation[0])
    for i in range(1, len(punctuation)):
        replace_string = "REPLACE({}, '{}', '')".format(replace_string, punctuation[i])

    return replace_string


if __name__ == "__main__":


    start = time.time()

    # Connect to the MySQL server
    connection = connect_to_server("127.0.0.1", "Cobyz1")   # input("Username: "))
    cursor = connection.cursor()

    # Create the database
    create_database(cursor)

    # Connect to the MySQL database
    connection = connect_to_db("127.0.0.1", "Cobyz1", "discodb")

    # --------- Artist data ---------

    # Create the artist tables
    create_artist_tables(connection)

    # Get the data to enter into the artist tables
    artist_list = get_artist_info()

    # Process and store the artist data
    artists_to_insert, name_vars_to_insert, aliases_to_insert, memberships_to_insert = process_artist_data(artist_list)

    # Insert all entries into the appropriate artist tables
    insert_artist_data(artists_to_insert, name_vars_to_insert, aliases_to_insert, memberships_to_insert)

    print(time.time() - start)

    # --------- Album data ---------

    # Create the album tables
    create_album_tables(connection)

    # Get the data to enter into the albums tables
    release_list = get_all_release_info()

    # Process the data to enter into the album tables
    # separate the data into appropriate groups
    albums_to_insert = []
    songs_to_insert = []
    initial_artist_song_credits_to_insert = []
    initial_artist_album_credits_to_insert = []
    genres_to_insert = []
    videos_to_insert = []

    song_count = 1
    for release in release_list:

        albums_to_insert.append((release.release_id, release.title, release.released, release.notes, len(release.tracklist)))

        for artist in release.artists:
            if artist.get("id"):
                # Add the artist's info to artist_album_credits_to_insert as a primary artist
                initial_artist_album_credits_to_insert.append((artist.get("id"), release.release_id, artist.get("role"), 1))

        for artist in release.extraartists:
            if artist.get("id"):
                # Add the artist's info to artist_album_credits_to_insert as a non-primary artist
                initial_artist_album_credits_to_insert.append((artist.get("id"), release.release_id, artist.get("role"), 0))
        for genre in release.genres_and_styles:
            genres_to_insert.append((release.release_id, genre))

        for song in release.tracklist:
            songs_to_insert.append((release.release_id, song.title, song.position, song.duration))

            for artist in song.artists:
                if artist.get("id"):
                    # Add the artist's info to artist_album_credits_to_insert as a primary artist
                    initial_artist_song_credits_to_insert.append((artist.get("id"), song_count, artist.get("role"), 1))

            for artist in song.extraartists:
                if artist.get("id"):
                    # Add the artist's info to artist_album_credits_to_insert as a non-primary artist
                    initial_artist_song_credits_to_insert.append((artist.get("id"), song_count, artist.get("role"), 0))

            song_count += 1
        for video in release.videos:
            videos_to_insert.append((release.release_id, video.src, video.title, video.duration))

    print("Song count:", song_count)

    # Remove invalid aliases
    # (aliases that point to artists that are not in artists_list)
    
    # Construct a dictionary of artist ids to allow for non-sequential lookup
    artist_ids = {}
    for artist in artist_list:
        artist_ids[artist.artist_id] = artist.artist_id

    # Construct a list of invalid aliases
    not_found_album_artists = []
    for artist in initial_artist_album_credits_to_insert:
        if not artist_ids.get(artist[0]):
            not_found_album_artists.append(artist)

    not_found_song_artists = []
    for artist in initial_artist_song_credits_to_insert:
        if not artist_ids.get(artist[0]):
            not_found_song_artists.append(artist)

    # Construct a dictionary of all aliases to allow for non-sequential lookup
    album_artists_dict = {}
    for artist in initial_artist_album_credits_to_insert:
        album_artists_dict[artist] = artist

    song_artists_dict = {}
    for artist in initial_artist_song_credits_to_insert:
        song_artists_dict[artist] = artist

    # Remove invalid aliases from album_artists_dict and song_artists_dict
    for artist in not_found_album_artists:
        try:
            album_artists_dict.pop(artist)
        except KeyError:
            pass
    for artist in not_found_song_artists:
        try:
            song_artists_dict.pop(artist)
        except KeyError:
            pass

    # Construct new lists with valid artists
    artist_album_credits_to_insert = []
    for artist in album_artists_dict:
        artist_album_credits_to_insert.append(artist)

    artist_song_credits_to_insert = []
    for artist in song_artists_dict:
        artist_song_credits_to_insert.append(artist)

    print("\nArtist list length differences:")
    print(len(initial_artist_album_credits_to_insert), len(artist_album_credits_to_insert), len(initial_artist_album_credits_to_insert) - len(artist_album_credits_to_insert))
    print(len(initial_artist_song_credits_to_insert), len(artist_song_credits_to_insert), len(initial_artist_song_credits_to_insert) - len(artist_song_credits_to_insert))

    insert_albums_query = """
                INSERT IGNORE INTO albums (album_id, album_title, release_date, notes, num_songs)
                VALUES (%s, %s, %s, %s, %s)"""

    insert_songs_query = """
                INSERT INTO songs (album_id, song_title, position, song_duration)
                VALUES (%s, %s, %s, %s)"""

    insert_artist_song_credits_query = """
                INSERT IGNORE INTO artist_song_credits (artist_id, song_id, artist_song_role, is_primary_artist)
                VALUES (%s, %s, %s, %s)"""

    insert_artist_album_credits_query = """
                INSERT IGNORE INTO artist_album_credits (artist_id, album_id, artist_album_role, is_primary_artist)
                VALUES (%s, %s, %s, %s)"""

    insert_genres_query = """
                INSERT IGNORE INTO genres (album_id, genre)
                VALUES (%s, %s)"""

    insert_videos_query = """
                INSERT IGNORE INTO videos (album_id, src, video_title, video_duration)
                VALUES (%s, %s, %s, %s)"""

    table_insertion_queries = {insert_albums_query: albums_to_insert,
                               insert_songs_query: songs_to_insert,
                               insert_artist_song_credits_query: artist_song_credits_to_insert,
                               insert_artist_album_credits_query: artist_album_credits_to_insert,
                               insert_genres_query: genres_to_insert,
                               insert_videos_query: videos_to_insert}

    for query in table_insertion_queries.keys():
        execute_many_and_commit(connection, query, table_insertion_queries[query])

    end = time.time()
    print(end - start)

"""
References used:
    For the functions to connect to the SQL server:
        https://www.freecodecamp.org/news/connect-python-with-sql/
    For the nested REPLACE function (Neil Menon's answer):    
        https://stackoverflow.com/questions/1289178/search-column-in-sql-database-ignoring-special-characters
    For how to use INSERT IGNORE:
        https://dev.mysql.com/doc/refman/8.0/en/insert.html
    For printing the affected rows from queries:
        https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html
"""