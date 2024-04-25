

class Artist:
    def __init__(self, artist_id, name, realname="", namevariations=[], groups=[], aliases=[], members=[]):
        self.artist_id = artist_id
        self.name = name
        self.real_name = realname
        self.name_variations = namevariations
        self.groups = groups
        self.aliases = aliases
        self.members = members

    def __str__(self):
        return (f'Artist ID = {self.artist_id}\n\
name = {self.name}\n\
real name = {self.real_name}\n\
name vars = {self.name_variations}\n\
groups = {self.groups}\n\
aliases = {self.aliases}\n\
members = {self.members}')

    # TODO: Create setter functions
