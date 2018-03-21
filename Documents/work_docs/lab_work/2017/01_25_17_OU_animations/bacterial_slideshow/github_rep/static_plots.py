import matplotlib.pyplot as plt
import scipy.io as sio
import numpy as np

folder='tl/'
files=['1.mat','2.mat','3.mat']
fig, axs = plt.subplots(nrows=4, ncols=1,figsize=(4,12))

variance_array = np.empty((3,50,))
variance_array[:] = np.NAN
axs = np.array(axs)
y=0
for file,ax in zip(files,axs.reshape(-1)):
    mat_contents=sio.loadmat(folder+file)
    cfp_dat=mat_contents['allcolordata'][0]
    t_max=len(cfp_dat[0])
    t_range=np.linspace(0,(t_max-1)*10,t_max)

    data_array=np.zeros((len(cfp_dat),t_max))
    z=0
    for cfp_datum in cfp_dat:
        # ax.plot(t_range,cfp_datum,color='teal',alpha=0.5,linewidth=2)
        data_array[z,:]=cfp_datum.ravel()
        z+=1


    variance_array[y,0:t_max]=np.std(data_array,0)#/np.mean(data_array,0)
    y += 1

np.save('tl',variance_array)
# # axs[3].errorbar(np.linspace(0,(40-1)*10,40),np.mean(variance_array,0),yerr=np.std(variance_array,0))
# axs[0].set_xlim([0,250])
# axs[1].set_xlim([0,250])
# axs[2].set_xlim([0,250])
# axs[3].set_xlim([0,250])
# axs[3].set_title('Variance overtime')
# plt.tight_layout()
# fig.suptitle('pBbS5k-cfpLAA')
# fig.savefig('static_plot.png')