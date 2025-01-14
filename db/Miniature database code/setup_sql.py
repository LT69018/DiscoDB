import time
from config import *
import mysql.connector
from mysql.connector import Error
from process_data import get_artist_info, get_release_info

NON_ROOT_PASSWORD = ""  # Optional: Fill this constant in with your user's password


def connect_to_server(host_name=DISCODB_MYSQL_URL, username=DISCODB_MYSQL_USERNAME, pswd=DISCODB_MYSQL_PASSWORD):
    """
    This function allows the user to connect to a MySQL server
        :param host_name: The host name of the server
        :param username: The username of the user to log in as
        :param pswd: The password of the user to log in as
        :return: A MySQL connection object
    """

    connection = None

    try:
        connection = mysql.connector.connect(host=host_name, user=username, password=pswd)
        print("Server connection successful!")
    except Error as error:
        print("Error connecting to the SQL server:", error)

    return connection


def connect_to_db(host_name=DISCODB_MYSQL_URL, username=DISCODB_MYSQL_USERNAME, pswd=DISCODB_MYSQL_PASSWORD,
                  db_name=DISCODB_NAME):
    """
    This function allows the user to connect to a specific database within a MySQL server
        :param host_name: The host name of the server
        :param username: The username of the user to log in as
        :param pswd: The password of the user to log in as
        :param db_name: The name of the database to connect to
        :return: A MySQL connection object
    """

    connection = None

    try:
        connection = mysql.connector.connect(host=host_name, user=username, password=pswd, database=db_name)
        print("Database connection successful!")
    except Error as error:
        print("Error connecting to the database:", error)

    return connection


def create_database(cursor):
    """
    This function creates the database
        :param cursor: A MySQL cursor object
        :return:
    """

    try:
        query = "CREATE DATABASE IF NOT EXISTS " + DISCODB_NAME
        cursor.execute(query)
        print("Database created successfully!")
    except Error as error:
        print("Error creating database:", error)


def create_artist_tables(connection):
    """
    This function creates the database tables related exclusively to artist data
        :param connection: A MySQL connection object
        :return: N/a
    """

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
    """
    This function parses the artist data passed in via artist_list
        :param artist_list: A list of Artist objects
        :return: artists_to_insert, name_vars_to_insert, aliases_to_insert, memberships_to_insert.
                 These are lists that will hold tuples to insert into the various artist-related tables
    """

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
            name_vars_to_insert.append((artist.artist_id, artist.name))
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
    """
    This function inserts all tuples for the artist-related tables
        :param artists_to_insert: A list of tuples to insert into the artists table
        :param name_vars_to_insert: A list of tuples to insert into the name_variations table
        :param aliases_to_insert: A list of tuples to insert into the artist_aliases table
        :param memberships_to_insert: A list of tuples to insert into the band_membership table
        :return: N/a
    """

    insert_artists_query = """
                INSERT IGNORE INTO artists (artist_id, artist_name, real_name) 
                VALUES (%s, %s, %s)"""
    insert_name_vars_query = """
                INSERT IGNORE INTO name_variations (artist_id, name_variation) 
                VALUES (%s, %s)"""
    insert_aliases_query = """
                INSERT IGNORE INTO artist_aliases (artist_id, artist_alias_id) 
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
    """
    This function creates the database tables related to album data
        :param connection: A MySQL connection object
        :return: N/a
    """

    create_albums_table = """
            CREATE TABLE IF NOT EXISTS albums (
                album_id        INT,
                album_title     VARCHAR(2048) DEFAULT 'Untitled',
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
                song_title      VARCHAR(2048) DEFAULT 'Untitled',
                position        VARCHAR(255),
                song_duration   VARCHAR(32),
                PRIMARY KEY (song_id),
                FOREIGN KEY (album_id) REFERENCES albums(album_id)
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

    table_creation_queries = [create_albums_table, create_songs_table, create_artist_album_credits_table,
                              create_genres_table,
                              create_videos_table]
    for query in table_creation_queries:
        execute_and_commit(connection, query)


def create_user_tables(connection):
    """
    This function creates the database tables related to user data
        :param connection: A MySQL connection object
        :return: N/a
    """

    create_users_table = """
            CREATE TABLE IF NOT EXISTS users (
                user_id             INT AUTO_INCREMENT,
                username            VARCHAR(255),
                user_salt           VARCHAR(256) NOT NULL,
                user_pswd           VARCHAR(256) NOT NULL,
                user_full_name      VARCHAR(255),
                PRIMARY KEY (user_id, username)
                );
                """

    create_listening_table = """
            CREATE TABLE IF NOT EXISTS listening (
                user_id             INT,
                album_id            INT,
                listening_time      VARCHAR(16) NOT NULL,
                listening_method    VARCHAR(16),
                PRIMARY KEY (user_id, album_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                    ON DELETE CASCADE,
                FOREIGN KEY (album_id) REFERENCES albums(album_id),
                CHECK(listening_time IN ('Past', 'Present', 'Future')),
                CHECK(listening_method IN ('Vinyl', 'CD', 'Cassette', '8-Track', 'Digital', 'Other'))
                );
                """

    table_creation_queries = [create_users_table, create_listening_table]
    for query in table_creation_queries:
        execute_and_commit(connection, query)


def create_search_procedures(connection):
    """
    This function creates stored procedures for searching based on certain criteria
        :param connection: A MySQL connection object
        :return: N/a
    """

    # When using this procedure, use the cursor.callproc(proc_name, args=()) function
    # and get the results (as there will be 5 relations returned) using cursor.stored_results()
    create_search_by_album_id = """
            DELIMITER //
            CREATE PROCEDURE search_by_album_id (search_term INT)
                BEGIN
                    SELECT album_title, release_date, notes, num_songs FROM albums WHERE album_id = search_term;
                    SELECT song_title, position, song_duration FROM songs WHERE album_id = search_term;
                    SELECT genre FROM genres WHERE album_id = search_term;
                    SELECT src FROM videos WHERE album_id = search_term;
                    SELECT artist_name, is_primary_artist, artist_album_role FROM artist_album_credits NATURAL JOIN artists WHERE album_id = search_term ORDER BY is_primary_artist DESC, artist_name ASC;
                END//
            DELIMITER ;
            """

    create_search_user_listening = """
                DELIMITER //
                CREATE PROCEDURE search_user_listening (search_term VARCHAR(255))
                    BEGIN
                        SELECT album_id, album_title, release_date, artist_name 
                        FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums 
                        WHERE album_id 
                            IN (
                                SELECT album_id 
                                FROM listening
                                WHERE user_id = (
                                    SELECT user_id 
                                    FROM users
                                    WHERE username = search_term)
                            )
                            AND is_primary_artist ORDER BY album_id ASC, artist_name ASC;
                    END//
                DELIMITER ;
                """

    create_search_by_album_title = """
            DELIMITER //
            CREATE PROCEDURE search_by_album_title (search_term VARCHAR(2048))
                BEGIN
                    SELECT album_id, album_title, release_date, artist_name FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums 
                    WHERE
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                        REPLACE(album_title, '!', ''),
                        '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                        '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                        '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                        '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', '')
                            LIKE concat(
                                '%', REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                REPLACE(search_term, '!', ''),
                                '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                                '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                                '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                                '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', ''),
                                '%') COLLATE utf8mb4_0900_ai_ci AND is_primary_artist ORDER BY album_id ASC, artist_name ASC;
                END//
            DELIMITER ;
            """

    create_search_by_artist_name = """
            DELIMITER //
            CREATE PROCEDURE search_by_artist_name (search_term VARCHAR(255))
                BEGIN
                    SELECT album_id, album_title, release_date, artist_name FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums 
                    WHERE album_id
                        IN (
                            SELECT album_id FROM name_variations NATURAL JOIN artist_album_credits NATURAL JOIN albums WHERE
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(name_variation, '!', ''),
                            '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                            '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                            '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                            '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', '')
                                LIKE concat(
                                    '%', REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(search_term, '!', ''),
                                    '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                                    '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                                    '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                                    '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', ''),
                                    '%') COLLATE utf8mb4_0900_ai_ci
                            )
                        AND is_primary_artist ORDER BY album_id ASC, artist_name ASC;
                END//
            DELIMITER ;
            """

    create_search_by_song_title = """
            DELIMITER //
            CREATE PROCEDURE search_by_song_title (search_term VARCHAR(2048))
                BEGIN
                    SELECT album_id, album_title, release_date, artist_name FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums 
                    WHERE album_id
                        IN (
                            SELECT album_id FROM songs WHERE
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            REPLACE(song_title, '!', ''),
                            '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                            '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                            '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                            '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', '')
                                LIKE concat(
                                    '%', REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                                    REPLACE(search_term, '!', ''),
                                    '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                                    '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                                    '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                                    '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', ''),
                                    '%') COLLATE utf8mb4_0900_ai_ci
                            )
                        AND is_primary_artist ORDER BY album_id ASC, artist_name ASC;
                END//
            DELIMITER ;
            """

    procedure_creation_queries = [create_search_by_album_id, create_search_user_listening, create_search_by_album_title,
                                  create_search_by_artist_name, create_search_by_song_title]
    for query in procedure_creation_queries:
        execute_and_commit(connection, query)


def execute_and_commit(connection, query):
    """
    This function executes a MySQL query passed in as a parameter
        :param connection: A MySQL connection object
        :param query: A string representing a MySQL query
        :return: N/a
    """

    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully!")
        print("Number of rows affected by statement '{}': \n\t{}".format(query, cursor.rowcount))
    except Error as error:
        print("Error executing query:", error, "\nQuery with error:", query)


def execute_many_and_commit(connection, query, vals):
    """
    This function executes a set of MySQL queries passed in as a parameter
        :param connection: A MySQL connection object
        :param query: A string representing a MySQL query
        :param vals: A list of tuples representing rows to insert into a table
        :return: N/a
    """
    cursor = connection.cursor()
    try:
        cursor.executemany(query, vals)
        connection.commit()
        print("Queries executed successfully!")
        print("Number of rows affected by statement '{}': \n\t{}".format(query, cursor.rowcount))
    except Error as error:
        print("Error executing queries:", error, "\nQuery with error:", query)


if __name__ == "__main__":
    start = time.time()

    # Connect to the MySQL server
    connection = connect_to_server(DISCODB_MYSQL_URL, DISCODB_MYSQL_USERNAME, DISCODB_MYSQL_PASSWORD)
    cursor = connection.cursor()

    # Create the database
    create_database(cursor)

    # Connect to the MySQL database
    connection = connect_to_db(DISCODB_MYSQL_URL, DISCODB_MYSQL_USERNAME, DISCODB_MYSQL_PASSWORD, DISCODB_NAME)

    # --------- Create the user tables ---------
    create_user_tables(connection)

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
    release_list = get_release_info(artists_to_insert)

    # Process the data to enter into the album tables
    # separate the data into appropriate groups
    albums_to_insert = []
    songs_to_insert = []
    initial_artist_album_credits_to_insert = []
    genres_to_insert = []
    videos_to_insert = []

    song_count = 0
    for release in release_list:

        albums_to_insert.append(
            (release.release_id, release.title, release.released, release.notes, len(release.tracklist)))

        for artist in release.artists:
            if artist.get("id"):
                # Add the artist's info to artist_album_credits_to_insert as a primary artist
                initial_artist_album_credits_to_insert.append(
                    (artist.get("id"), release.release_id, artist.get("role"), 1))

        for artist in release.extraartists:
            if artist.get("id"):
                # Add the artist's info to artist_album_credits_to_insert as a non-primary artist
                initial_artist_album_credits_to_insert.append(
                    (artist.get("id"), release.release_id, artist.get("role"), 0))

        for genre in release.genres_and_styles:
            genres_to_insert.append((release.release_id, genre))

        for song in release.tracklist:
            songs_to_insert.append((release.release_id, song.title, song.position, song.duration))
            song_count += 1

        for video in release.videos:
            videos_to_insert.append((release.release_id, video.src, video.title, video.duration))

    print("Song count:", song_count)

    # Remove invalid artist_ids from initial_artist_album_credits_to_insert
    # (initial_artist_album_credits_to_insert that contain to artist_ids that are not in artists_list)

    # Construct a dictionary of artist ids to allow for non-sequential lookup
    artist_ids = {}
    for artist in artist_list:
        artist_ids[artist.artist_id] = artist.artist_id

    # Construct a list of invalid aliases
    not_found_album_artists = []
    for artist in initial_artist_album_credits_to_insert:
        if not artist_ids.get(artist[0]):
            not_found_album_artists.append(artist)

    # Construct a dictionary of all aliases to allow for non-sequential lookup
    album_artists_dict = {}
    for artist in initial_artist_album_credits_to_insert:
        album_artists_dict[artist] = artist

    # Remove invalid aliases from album_artists_dict and song_artists_dict
    for artist in not_found_album_artists:
        try:
            album_artists_dict.pop(artist)
        except KeyError:
            pass

    # Construct new lists with valid artists
    artist_album_credits_to_insert = []
    for artist in album_artists_dict:
        artist_album_credits_to_insert.append(artist)

    print("\nArtist credits list length differences:")
    print(len(initial_artist_album_credits_to_insert), len(artist_album_credits_to_insert),
          len(initial_artist_album_credits_to_insert) - len(artist_album_credits_to_insert))

    insert_albums_query = """
                INSERT IGNORE INTO albums (album_id, album_title, release_date, notes, num_songs)
                VALUES (%s, %s, %s, %s, %s)"""

    insert_songs_query = """
                INSERT IGNORE INTO songs (album_id, song_title, position, song_duration)
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

    # The songs insertion is done last because it is the most likely to fail
    table_insertion_queries = {insert_albums_query: albums_to_insert,
                               insert_artist_album_credits_query: artist_album_credits_to_insert,
                               insert_genres_query: genres_to_insert,
                               insert_videos_query: videos_to_insert,
                               insert_songs_query: songs_to_insert}

    for query in table_insertion_queries.keys():
        # Split the execution of song insertion into 20 parts.
        # If this is not done, the program is likely to crash because of its high RAM usage
        if query == insert_songs_query:
            song_count_twentieths = song_count // 20

            for i in range(1, 21):
                if i == 20:
                    execute_many_and_commit(connection, insert_songs_query,
                                            songs_to_insert[song_count_twentieths * (i - 1):])
                else:
                    execute_many_and_commit(connection, insert_songs_query,
                                            songs_to_insert[song_count_twentieths * (i - 1):song_count_twentieths * i])
            pass
        else:
            execute_many_and_commit(connection, query, table_insertion_queries[query])

    # --------- Create the stored procedures for the database ---------
    create_search_procedures(connection)

    end = time.time()
    print(end - start)

"""
References used:
    For the functions to connect to the SQL server:
        https://www.freecodecamp.org/news/connect-python-with-sql/
    For how to use INSERT IGNORE:
        https://dev.mysql.com/doc/refman/8.0/en/insert.html
    For printing the affected rows from queries:
        https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html
"""
