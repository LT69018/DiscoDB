from config import *
from artist import Artist
from releases import Release, Track, Video
from os.path import join as os_path_join
from lxml import etree
import time

parser = etree.XMLParser(remove_blank_text=True)


def get_artist_info():
    """
    This function parses through the artist XML file and turns each entry into an Artist object
        :return: A list of Artist objects
    """

    with open(os_path_join(DATASET_FOLDER_PATH, ARTISTS_DATASET_FILE_NAME), "rb") as my_file:
        start = time.time()

        tree = etree.parse(my_file, parser)
        root = tree.getroot()

        parse_end = time.time()
        print("XML Parse time:", parse_end - start)

        artist_list = []

        # Base list of target artists created by listing 5 popular artists
        # and also using 3 suggested artists from each team member
        target_artists = ["Taylor Swift", "Olivia Rodrigo", "Billie Eilish", "The Beatles", "The Rolling Stones",
                          "Erykah Badu", "Stevie Wonder", "Tank and the Bangas",
                          "AC/DC", "Weston Estate", "Bad Bunny",
                          "Benny Sings", "The Internet", "Anderson .Paak",
                          "The Mothers", "Santana", "The Doors"]
        found_artists = []

        past_len_target = 0
        past_len_found = 0

        # Run through the list of artists until the length of both
        # target_artists and found_artists does not change between rounds
        while past_len_target != len(target_artists) or past_len_found != len(found_artists):
            print("\n\nlen(target_artists):", len(target_artists))
            print("len(found_artists):", len(found_artists))

            round_start = time.time()

            past_len_target = len(target_artists)
            past_len_found = len(found_artists)

            for artist in root:
                artist_id = ""
                name = ""
                realname = ""
                namevariations = []
                groups = []
                aliases = []
                members = []

                # Check if this is a target artist
                create_artist = False
                for sub_tag in artist:
                    if sub_tag.tag == "name":
                        name = sub_tag.text
                        # If the artist's name does not match a target artist,
                        # break the search and move onto the next artist
                        if name not in target_artists:
                            break
                        # Otherwise, ...
                        else:
                            # If we have not found come across this artist yet,
                            # add them to the found_artists list and set the create_artist flag
                            # to know we will need to parse their info and add them to artist_list
                            if name not in found_artists:
                                found_artists.append(name)
                                create_artist = True

                # Move onto the next artist
                if not create_artist:
                    continue

                # Process the artist's data
                for sub_tag in artist:
                    if sub_tag.tag == "id":
                        artist_id = sub_tag.text

                    if sub_tag.tag == "name":
                        name = sub_tag.text

                    if sub_tag.tag == "realname":
                        realname = sub_tag.text

                    if sub_tag.tag == "namevariations":
                        for name_var in sub_tag.iter("name"):
                            namevariations.append(name_var.text)

                    if sub_tag.tag == "groups":
                        for group in sub_tag.iter("name"):
                            groups.append((group.get("id"), group.text))

                    if sub_tag.tag == "aliases":
                        for alias in sub_tag.iter("name"):
                            aliases.append((alias.get("id"), alias.text))
                            if alias.text not in target_artists:
                                target_artists.append(alias.text)

                    if sub_tag.tag == "members":
                        for member in sub_tag.iter("name"):
                            members.append((member.get("id"), member.text))
                            if member.text not in target_artists:
                                target_artists.append(member.text)

                artist_list.append(Artist(artist_id, name, realname, namevariations, groups, aliases, members))
            print(time.time() - round_start)

        # Print out some useful logging information
        print("\n\ntarget_artists:", target_artists, len(target_artists))
        print("\nfound_artists:", found_artists, len(found_artists))
        print("\nlen(target_artists):", len(target_artists))
        print("len(found_artists):", len(found_artists))
        print(set(target_artists) - set(found_artists), len(set(target_artists) - set(found_artists)))
        print(set(found_artists) - set(target_artists), len(set(found_artists) - set(target_artists)))
        print(len(set(target_artists)), len(set(found_artists)))
        print("\nartist_list:", len(artist_list))
        end = time.time()
        print(end - start, "\n")

        return artist_list


def get_release_info(artist_list):
    """
    This function parses through the releases XML file and turns each entry into a Release object
        :param artist_list: A list of artist names to search for releases by them
        :return: A list of Release objects
    """

    with open(os_path_join(DATASET_FOLDER_PATH, ALL_RELEASES_DATASET_FILE_NAME), "rb") as my_file:

        start = time.time()

        total_releases_list = []

        target_artists = []
        for artist in artist_list:
            target_artists.append(artist[1])

        tree = etree.parse(my_file, parser)
        root = tree.getroot()

        end = time.time()
        print("XML Parse time:", end - start)

        for release in root:
            release_id = release.get("id")
            title = ""
            artists = []
            extraartists = []
            genres_and_styles = []
            year = "0"
            found_released = ""
            notes = None
            tracklist = []
            videos = []

            # Check if this release has a target artist that worked on it
            found_target = False
            for sub_tag in release:
                if sub_tag.tag == "artists":
                    for artist in sub_tag.iter("artist"):
                        for artist_tags in artist:
                            if artist_tags.tag == "name":
                                if artist_tags.text in target_artists:
                                    found_target = True
                                    break
                        if found_target:
                            break
                    if found_target:
                        break
                if sub_tag.tag == "extraartists":
                    for artist in sub_tag.iter("artist"):
                        for artist_tags in artist:
                            if artist_tags.tag == "name":
                                if artist_tags.text in target_artists:
                                    found_target = True
                                    break
                        if found_target:
                            break
                    if found_target:
                        break

            if not found_target:
                continue

            # Process the release's data
            for sub_tag in release:
                if sub_tag.tag == "artists":
                    for artist in sub_tag.iter("artist"):
                        artist_dict = {"role": None}
                        for artist_tags in artist:
                            if artist_tags.tag == "id":
                                artist_dict[artist_tags.tag] = artist_tags.text
                            if artist_tags.tag == "role":
                                artist_dict[artist_tags.tag] = artist_tags.text
                        artists.append(artist_dict)
                    continue

                if sub_tag.tag == "title":
                    title = sub_tag.text
                    continue

                if sub_tag.tag == "extraartists":
                    for artist in sub_tag.iter("artist"):
                        extra_artist_dict = {"role": None}
                        for artist_tags in artist:
                            if artist_tags.tag == "id":
                                extra_artist_dict[artist_tags.tag] = artist_tags.text
                            if artist_tags.tag == "role":
                                extra_artist_dict[artist_tags.tag] = artist_tags.text
                        extraartists.append(extra_artist_dict)
                    continue

                if sub_tag.tag == "genres" or sub_tag.tag == "styles":
                    for genre_or_style in sub_tag.iter("genre", "style"):
                        genres_and_styles.append(genre_or_style.text)
                    continue

                if sub_tag.tag == "released":
                    found_released = sub_tag.text
                    continue

                if sub_tag.tag == "notes":
                    notes = sub_tag.text
                    continue

                if sub_tag.tag == "tracklist":
                    for track in sub_tag.iter("track"):
                        track_dict = {"title": "", "position": "", "duration": "", "artists": [], "extraartists": []}

                        for track_tags in track:
                            if track_tags.tag == "position":
                                track_dict[track_tags.tag] = track_tags.text
                            if track_tags.tag == "title":
                                track_dict[track_tags.tag] = track_tags.text
                            if track_tags.tag == "duration":
                                track_dict[track_tags.tag] = track_tags.text
                            if track_tags.tag == "artists":
                                track_dict[track_tags.tag] = []
                                for artist in sub_tag.iter("artist"):
                                    artist_dict = {"role": None}
                                    for artist_tags in artist:
                                        if artist_tags.tag == "id":
                                            artist_dict[artist_tags.tag] = artist_tags.text
                                        if artist_tags.tag == "role":
                                            artist_dict[artist_tags.tag] = artist_tags.text
                                    track_dict[track_tags.tag].append(artist_dict)
                            if track_tags.tag == "extraartists":
                                track_dict[track_tags.tag] = []
                                for artist in sub_tag.iter("artist"):
                                    extra_artist_dict = {"role": None}
                                    for artist_tags in artist:
                                        if artist_tags.tag == "id":
                                            extra_artist_dict[artist_tags.tag] = artist_tags.text
                                        if artist_tags.tag == "role":
                                            extra_artist_dict[artist_tags.tag] = artist_tags.text
                                    track_dict[track_tags.tag].append(extra_artist_dict)
                        tracklist.append(Track(track_dict["title"], track_dict["position"], track_dict["duration"],
                                               track_dict["artists"], track_dict["extraartists"]))
                    continue

                if sub_tag.tag == "videos":
                    for video in sub_tag.iter("video"):
                        video_dict = {"src": video.get("src"),
                                      "duration": video.get("duration")}

                        for video_title in video.iter("title"):
                            video_dict[video_title.tag] = video_title.text

                        videos.append(Video(video_dict["src"], video_dict["duration"], video_dict["title"]))

            if year == "0":
                year = "Unknown release date"

            if found_released:
                released = found_released
            else:
                released = year

            total_releases_list.append(Release(release_id, title, artists, extraartists, genres_and_styles, released, notes, tracklist, videos))

        end = time.time()
        print(end - start)

        print(len(total_releases_list), "\n")

        return total_releases_list
