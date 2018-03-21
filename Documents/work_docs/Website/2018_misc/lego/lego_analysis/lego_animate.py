import matplotlib.pyplot as plt
import random
from matplotlib.patches import Rectangle
import pandas as pd
import numpy as np
from matplotlib import animation, rc
from matplotlib.colors import LinearSegmentedColormap
import matplotlib as mpl



# plt.style.use('rossidata')
from matplotlib import rcParams

rcParams['font.family'] = 'sans-serif'
rcParams['font.sans-serif'] = ['Futura-Bold']

def main(data):
    plt.close('all')
    cmap1 = LinearSegmentedColormap.from_list("my_colormap",
                                              ((58 / 255, 28 / 255, 113 / 255), (1, 136 / 255, 136 / 255)), N=67,
                                              gamma=1.0)

    fig_animate, (ax0, ax1) = plt.subplots(1, 2, figsize=(12, 4), gridspec_kw={'width_ratios': [1.4, 2]})

    NUM = 161
    xys = []

    scaler = 1
    for n in range(NUM):
        if n % 10 == 0:
            scaler += 1
        xys.append(((n % 10), scaler))

    ells = [Rectangle(xy=xys[i], width=.5, height=.75, angle=90)
            for i in range(NUM)]

    ax0.set_xlim([-3, 10])
    ax0.set_ylim([2, 20])


    ax0.axis('off')
    years=list(set(data['year']))

    means = []

    for year in years:
        means.append(np.nanmean(data['num_parts'][data['year'] <= year]))
    expon = 6

    ax1.set_ylim([-0.2, 1.2])

    v0 = random.randint(0, 5)

    bins = np.logspace(-1, 3.1, 100)

    ax1.set_xscale('symlog')

    hists = [ax1.plot([], [], drawstyle='steps-pre', color='salmon', linewidth=5)]
    ax1.set_xlim([1, 1000])
    ax1.set_ylim([.000001, 1.05])
    x_vect = np.linspace(0, 10, 100)
    x_vect = np.linspace(0, 10, 80)
    y = (x_vect / 5) ** 5 / (1 + (x_vect / 5) ** 5)
    y2 = ((x_vect / 5) ** 5 / (1 + (x_vect / 5) ** 5))[::-1]
    marker_vect = np.append(y, y2[::4]) * 60
    time_text1 = ax0.text(2, 19, '', fontsize=14, fontweight='bold')

    time_text = ax1.text(3, 0.9, '', fontsize=14, fontweight='bold')
    scaler = 1
    for n in range(NUM):
        if n % 10 == 9:
            scaler += 1
        xys.append((n % 10, scaler))

    color_list = LinearSegmentedColormap.from_list("my_colormap",
                                                   ((58 / 255, 28 / 255, 113 / 255), (1, 136 / 255, 136 / 255)), N=67,
                                                   gamma=1.0)

    # color_list = cm.rainbow(np.linspace(0, 1, 67))
    ells = [Rectangle(xy=xys[i], width=.5, height=.75, angle=90)
            for i in range(NUM)]



    def animate(z):
        if z == 0:
            start = 0

        if (data['year'] == (1950 + z)).any():
            #         probs,bons=np.histogram(data['num_parts'][data['year']==(1950+z)],normed='True', bins=bins)
            probs, bons = np.histogram(data['num_parts'][data['year'] <= (1950 + z)], normed='True', bins=bins)

            ax1.plot(bons[1:], np.cumsum(probs / np.sum(probs)), drawstyle='steps-pre', color=color_list(z), alpha=0.5,
                     linewidth=3)
            yr_idx = years.index(1950 + z)
            upper = int(np.round(means[yr_idx]))
            if yr_idx == 0:
                lower = 0
            else:
                lower = int(np.round(means[yr_idx - 1]))

            for j, e in enumerate(ells[lower:upper]):
                ax0.add_artist(e)

                e.set_facecolor(color_list(z))
            time_text1.set_text(str(upper))
        time_text.set_text(str(1950 + z))

    # # call the animator. blit=True means only re-draw the parts that have changed.
    # 400 total frames
    return animation.FuncAnimation(fig_animate, animate, frames=67, interval=200, blit=False)


if __name__ == "__main__":
    data = pd.read_csv('sets.csv')
    data = data.sort_values('year')
    anim3=main(data)
    dpi = 300
    writer = animation.writers['ffmpeg'](fps=30)
    anim3.save('figures/graph_cm.mp4', writer=writer, dpi=dpi)

