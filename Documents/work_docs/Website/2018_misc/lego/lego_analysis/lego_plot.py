import matplotlib.pyplot as plt
import pandas as pd
import matplotlib.cm as cm

import numpy as np
from matplotlib.colors import LinearSegmentedColormap

plt.style.use('rossidata')
from matplotlib import rcParams

rcParams['font.family'] = 'sans-serif'
rcParams['font.sans-serif'] = ['Futura-Bold']


def main():
    # importing the data
    data = pd.read_csv('sets.csv')
    data = data.sort_values('year')
    themes = pd.read_csv('themes.csv')
    data['theme_id'] = data['theme_id'].map(themes.set_index('id')['name'])

    #### FIGURE 1 : kit sizes over time
    plt.close('all')
    fig, ax = plt.subplots(figsize=(3 * 3, 2 * 3))

    ax.scatter(data['year'], data['num_parts'], color='#FF8888', alpha=0.25)
    ax.set_ylabel('Number of Pieces in Set')

    ax.set_xlabel('Year')
    ax.set_title('Kit Sizes over Time')

    fig.savefig("figures/scatter.png", dpi=300, transparent=True)

    #### FIGURE 2 : Kit distributions over time

    cmap1 = LinearSegmentedColormap.from_list("my_colormap",
                                              ((58 / 255, 28 / 255, 113 / 255), (1, 136 / 255, 136 / 255)), N=67,
                                              gamma=1.0)

    plt.close('all')
    fig, (ax0, ax) = plt.subplots(1, 2, figsize=(12, 4))
    color_list = cm.rainbow(np.linspace(0, 1, 67))
    bins = np.logspace(-1, 3.8, 40)
    ax.set_xscale('symlog')
    means = []
    stds = []
    years = []

    for z in range(67):
        if (data['year'] == (1950 + z)).any():
            probs, bons = np.histogram(data['num_parts'][data['year'] <= (1950 + z)], normed='True', bins=bins)
            means.append(np.nanmean(data['num_parts'][data['year'] <= (1950 + z)]))
            stds.append(np.nanstd(data['num_parts'][data['year'] <= (1950 + z)]))
            years.append(1950 + z)

            ax.plot(bons[1:], probs / np.sum(probs), color=cmap1(z), drawstyle='steps-pre')

            ax0.scatter(1950 + z, np.nanmean(data['num_parts'][data['year'] <= (1950 + z)]), color=cmap1(z))

    ax.set_xlim([1, 1000])
    fig.suptitle('Kit Distributions over Time')
    fig.savefig("figures/two_pannel.png", dpi=300, transparent=True)

    #### FIGURE 3 : Number of kits in Each theme
    plt.close('all')
    fig, ax = plt.subplots(figsize=(12, 20))
    data.theme_id = data.theme_id.replace(
        {"Star Wars Clone Wars": "Star Wars", "Classic Space": "Space", "Star Wars Episode 4/5/6": "Star Wars",
         "Supplemental": "No Theme"})
    objects = data['theme_id'].value_counts().index.tolist()
    y_pos = np.arange(len(objects))

    ax.bar(y_pos * 1.5 + 1, data['theme_id'].value_counts()[:], align='center', color=["#FF8888"])
    ax.set_xticks(y_pos * 1.5 + 1)
    ax.set_xticklabels(objects)
    ax.set_xlim([0, 45])
    plt.xticks(rotation=-270)

    plt.yticks(rotation=90)

    ax.set_ylabel('Number of Sets')
    fig.savefig("figures/hist.png", dpi=300, transparent=True)

    #### FIGURE 4 : Kit Complexity over Time

    year = []
    num_themes = []
    all_themes = []
    running_count = 0
    for z in range(67):
        if (data['year'] == (1950 + z)).any():
            themes = list(set(data['theme_id'][data['year'] == (1950 + z)]))
            year.append(1950 + z)
            for theme in themes:
                if theme not in all_themes:
                    running_count += 1
                    all_themes.append(theme)
            num_themes.append(running_count)
    plt.close('all')
    fig, ax = plt.subplots(figsize=(12, 12))

    from matplotlib.path import Path

    verts = [
        (0., 0.),  # left, bottom
        (0., .5),  # left, top
        (.1, .5),
        (.1, .6),
        (.4, .6),
        (.4, .5),
        (.6, .5),
        (.6, .6),
        (.9, .6),
        (.9, .5),
        (1., .5),  # right, top
        (1., 0.),  # right, bottom
        (0., 0.),  # ignored
    ]

    codes = [Path.MOVETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.LINETO,
             Path.CLOSEPOLY,
             ]

    path = Path(verts, codes)

    for z, yar in enumerate(year):
        ax.plot(yar, num_themes[z], marker=path, markersize=60, linewidth=3, color=cmap1(z), alpha=.75,
                markeredgewidth=0.0)

    fig.savefig("figures/kit_complexity.png", transparent=True)


if __name__ == "__main__":
    main()
