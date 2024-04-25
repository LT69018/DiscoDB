
class Track:
    def __init__(self, title, position="", duration="", artists=[], extraartists=[]):
        self.title = title
        self.position = position
        self.duration = duration
        self.artists = artists
        self.extraartists = extraartists


class Video:
    def __init__(self, src, duration="", title=""):
        self.src = src
        self.duration = duration
        self.title = title
                            
                            
class Release:
    def __init__(self, release_id, title="Untitled", artists=[], extraartists=[], genres_and_styles=[], released="Unknown", notes="", tracklist=[], videos=[]):
        self.release_id = release_id
        self.title = title
        self.artists = artists
        self.extraartists = extraartists
        self.genres_and_styles = genres_and_styles
        self.released = released
        self.notes = notes
        self.tracklist = tracklist
        self.videos = videos
