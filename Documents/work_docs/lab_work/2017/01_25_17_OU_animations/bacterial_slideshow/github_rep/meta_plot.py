import numpy as np
import matplotlib.pyplot as plt
import os
import scipy.io as sio

def plt_function():
    fig,ax=plt.subplots()
    files=['s5k.npy','svk.npy','tl.npy']
    labels=['s5k','svk','A5k-marA:cfp']
    colors=['teal','orange','purple']
    j=0
    for file in files:
        data=np.load(file)**2
        t_range=np.linspace(0,(np.size(data,1)-1)*10,np.size(data,1))
        ax.errorbar(t_range,np.nanmean(data,0),yerr=np.nanmean(data,0),color=colors[j],alpha=0.5,linewidth=3,label=labels[j])
        j+=1
    ax.legend()
    ax.set_xlim([0,400])
    plt.tight_layout()
    plt.title('CV over time')
    fig.savefig('meta_plot.png')

if __name__== "__main__" :

    folders = ['S5k_cfplaa/','SVK_cfplaa/','tl/']
    file_names=['s5k','svk','tl']
    for k,folder in enumerate(folders):
        names=os.listdir(folder)
        names.remove('.DS_Store')


        variance_array = np.empty((len(names), 50,))
        variance_array[:] = np.NAN
        y = 0
        for file in names:
            mat_contents = sio.loadmat(folder + file)
            cfp_dat = mat_contents['allcolordata'][0]
            t_max = len(cfp_dat[0])
            t_range = np.linspace(0, (t_max - 1) * 10, t_max)

            data_array = np.zeros((len(cfp_dat), t_max))
            z = 0
            for cfp_datum in cfp_dat:
                # ax.plot(t_range,cfp_datum,color='teal',alpha=0.5,linewidth=2)
                data_array[z, :] = cfp_datum.ravel()
                z += 1

            variance_array[y, 0:t_max] = np.nanstd(data_array, 0)/np.nanmean(data_array,0)
            y += 1

        np.save(file_names[k], variance_array)
    plt_function()