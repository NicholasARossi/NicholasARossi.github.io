import matplotlib.image as mpimg
import numpy as np
from scipy.misc import imsave
import matplotlib.pyplot as plt
from matplotlib import animation, rc
import os
import shutil

def name_generator(mt,xy,ml):
    phase_names = [mt + str(i + 1).zfill(2) + "xy" + xy + "c1.tif" for i in range(ml)]
    c_names = [mt + str(i + 1).zfill(2) + "xy" + xy + "c2.tif" for i in range(ml)]
    y_names = [mt + str(i + 1).zfill(2) + "xy" + xy + "c3.tif" for i in range(ml)]
    r_names = [mt + str(i + 1).zfill(2) + "xy" + xy + "c4.tif" for i in range(ml)]
    return phase_names,c_names,y_names,r_names

def make_rgb(image):
    return (image * 255).round().astype(np.uint8)

def create_combined_images(infolder,mt,xy,ml):
    phase_names, c_names, y_names, r_names=name_generator(mt,xy,ml)
    if not os.path.exists('temp_images'):
        os.makedirs('temp_images')
    for z in np.arange(ml):
        cim = np.array(mpimg.imread(infolder + '/' + c_names[z]))
        pim = np.array(mpimg.imread(infolder + '/' + phase_names[z]))
        yim = np.array(mpimg.imread(infolder + '/' + y_names[z]))

        # rescaling values
        cscale = [500, 4000]
        yscale = [500, 3000]
        pscale = [500, 3000]

        cim[cim > cscale[1]] = cscale[1]
        cim[cim < cscale[0]] = cscale[0]

        yim[yim > yscale[1]] = yscale[1]
        yim[yim < yscale[0]] = yscale[0]

        pim[pim > pscale[1]] = pscale[1]
        pim[pim < pscale[0]] = pscale[0]

        cim = (cim - cscale[0]) / (cscale[1] - cscale[0])
        pim = (pim - pscale[0]) / (pscale[1] - pscale[0])
        yim = (yim - yscale[0]) / (yscale[1] - yscale[0])
        # combined_array=np.zeros
        cfp_img = []
        yfp_img = []
        phase_img = []

        combined_img = []
        for i in range(len(cim[:])):
            c_row = []
            p_row = []
            y_row = []
            combined_row = []
            for j in range(len(cim[1])):
                c_temp_val = [0, cim[i][j], cim[i][j]]
                p_temp_val = [pim[i][j], pim[i][j], pim[i][j]]
                y_temp_val = [yim[i][j], yim[i][j], 0]

                combined_temp_val = [0 + pim[i][j] + yim[i][j], yim[i][j] + cim[i][j] + pim[i][j],
                                     cim[i][j] + pim[i][j]]
                c_row += [c_temp_val]
                p_row += [p_temp_val]
                y_row += [y_temp_val]
                combined_row += [combined_temp_val]
            cfp_img.append(c_row)
            yfp_img.append(y_row)
            phase_img.append(p_row)
            combined_img.append(combined_row)

        imsave('temp_images'+'/' + str(z) + '.png', combined_img)



def create_movie(ml):
    fig = plt.figure()
    ax = fig.add_subplot(111)



    def animate(z):
        im = mpimg.imread('temp_images/' + str(z) + '.png')
        ax.imshow(im)
        z += 1


    # call the animator. blit=True means only re-draw the parts that have changed.
    anim = animation.FuncAnimation(fig, animate,
                                    frames=ml, interval=200, blit=False)

    Writer = animation.writers['ffmpeg']
    writer = Writer(fps=5, metadata=dict(artist='Me'), bitrate=1800)
    anim.save('im.mp4', writer=writer)
    shutil.rmtree('temp_images')


