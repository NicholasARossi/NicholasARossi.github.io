import movie_functions as mf
### Set folder title:
mt="one_tx_one_tlt"

### Set Movie Length
ml=32


### set xy position
xy="1"

### Set directory for raw tiff folder
raw_tiff_folder="select_channel_tiff_extracts"


infolder='select_channel_tiff_extracts'

mf.create_combined_images(infolder,mt,xy,ml)
mf.create_movie(ml)

