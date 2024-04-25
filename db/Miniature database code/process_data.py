from lxml import etree
import time

import os.path.join 
from artist import Artist
from releases import Release, Track, Video

from config import DATASET_FOLDER_PATH

parser = etree.XMLParser(remove_blank_text=True)


# Set up the Artists table
def get_artist_info():
    with open(os.path.join(DATASET_FOLDER_PATH, ARTISTS_DATASET_FILE_NAME), "rb") as my_file:
        start = time.time()

        tree = etree.parse(my_file, parser)
        root = tree.getroot()

        artist_list = []

        count = 0
        for artist in root:

            artist_id = ""
            name = ""
            realname = ""
            namevariations = []
            groups = []
            aliases = []
            members = []

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

                if sub_tag.tag == "members":
                    for member in sub_tag.iter("name"):
                        members.append((member.get("id"), member.text))

            artist_list.append(Artist(artist_id, name, realname, namevariations, groups, aliases, members))
            count += 1
            
            if count >= 100:
                break

        end = time.time()
        print(end - start)

        return artist_list


def get_all_release_info():
    with open(os.path.join(DATASET_FOLDER_PATH, ALL_RELEASES_DATASET_FILE_NAME), "rb") as file_1:

        start = time.time()

        files = [file_1]

        total_releases_list = []

        for my_file in files:
            tree = etree.parse(my_file, parser)
            root = tree.getroot()

            count = 0
            for release in root:
                # print(count, artist)

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
                    year = "Unknown"

                if found_released:
                    released = found_released
                else:
                    released = year

                total_releases_list.append(Release(release_id, title, artists, extraartists, genres_and_styles, released, notes, tracklist, videos))
                count += 1

                if count >= 100:
                    break

            end = time.time()
            print(end - start)

            print(count, len(total_releases_list))
            
        print(len(total_releases_list))

        return total_releases_list
