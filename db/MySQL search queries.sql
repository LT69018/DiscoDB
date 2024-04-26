-- THIS IS THE FINAL QUERY STRUCTURE FOR SEARCHING BY ALBUM NAME
SELECT album_id, album_title, release_date, artist_name FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums WHERE
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
            REPLACE('bongo fury', '!', ''),
            '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
            '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
            '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
            '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', ''),
            '%') collate utf8mb4_0900_ai_ci and is_primary_artist;

-- THIS IS THE FINAL QUERY STRUCTURE FOR SEARCHING BY ARTIST NAME
SELECT album_id, album_title, release_date, artist_name FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums WHERE
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(album_id, '!', ''),
    '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
    '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
    '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
    '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', '')
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
                    REPLACE('zappa', '!', ''),
                    '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                    '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                    '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                    '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', ''),
                    '%') collate utf8mb4_0900_ai_ci
            )
        and is_primary_artist;

-- THIS IS THE FINAL QUERY STRUCTURE FOR SEARCHING BY SONG TITLE
SELECT album_id, album_title, release_date, artist_name FROM artists NATURAL JOIN artist_album_credits NATURAL JOIN albums WHERE
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(album_id, '!', ''),
    '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
    '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
    '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
    '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', '')
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
                    REPLACE('muffin man', '!', ''),
                    '"', ''), '#', ''), '$', ''), '%', ''), '&', ''), '\'', ''), '(', ''), ')', ''),
                    '*', ''), '+', ''), ',', ''), '-', ''), '.', ''), '/', ''), ':', ''), ';', ''),
                    '<', ''), '=', ''), '>', ''), '?', ''), '@', ''), '[', ''), '\\', ''), ']', ''),
                    '^', ''), '_', ''), '`', ''), '{', ''), '|', ''), '}', ''), '~', ''), ' ', ''), '\n', ''),
                    '%') collate utf8mb4_0900_ai_ci
            )
        and is_primary_artist;