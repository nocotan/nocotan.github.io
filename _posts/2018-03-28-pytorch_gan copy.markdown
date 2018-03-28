---
layout: post
title:  "PyTorchでGAN"
date:   2018-03-28 12:00:00
categories: 機械学習
---

GANを用いた手書き文字生成のPyTorch実装．


```python
%matplotlib inline
from IPython import display

import itertools
import math
import time
import matplotlib.pyplot as plt

import torch
from torch.autograd import Variable
from torch.utils.data import DataLoader
import torchvision
import torch.nn as nn
from torchvision import datasets
from torchvision import transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=(0.5, 0.5, 0.5), std=(0.5, 0.5, 0.5))
])

train_dataset = datasets.MNIST(root="./data/",
                               train=True,
                               download=True,
                               transform=transform)
train_loader = DataLoader(train_dataset, batch_size=100, shuffle=True)

class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(784, 1024),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Dropout(0.3),
            nn.Linear(1024, 512),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        h = self.model(x.view(x.size(0), 784))
        h = h.view(h.size(0), -1)
        return h


class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(100, 256),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Linear(512, 1024),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Linear(1024, 784),
            nn.Tanh()
        )

    def forward(self, x):
        h = x.view(x.size(0), 100)
        h = self.model(h)
        return h


dis = Discriminator()
gen = Generator()

criterion = nn.BCELoss()
lr = 0.0002
d_optimizer = torch.optim.Adam(dis.parameters(), lr=lr)
g_optimizer = torch.optim.Adam(gen.parameters(), lr=lr)

def train_discriminator(dis, x_real, y_real, x_fake, y_fake):
    dis.zero_grad()
    outputs = dis(x_real)
    real_loss = criterion(outputs, y_real)
    real_score = outputs
    
    outputs = dis(x_fake)
    fake_loss = criterion(outputs, y_fake)
    fake_score = outputs
    
    d_loss = real_loss + fake_loss
    d_loss.backward()
    d_optimizer.step()
    
    return d_loss, real_score, fake_score


def train_generator(gen, dis_outputs, y_real):
    gen.zero_grad()
    g_loss = criterion(dis_outputs, y_real)
    g_loss.backward()
    g_optimizer.step()
    return g_loss


num_test_samples = 16
test_noise = Variable(torch.randn(num_test_samples, 100))

size_figure_grid = int(math.sqrt(num_test_samples))
fig, ax = plt.subplots(size_figure_grid, size_figure_grid, figsize=(6, 6))
for i, j in itertools.product(range(size_figure_grid), range(size_figure_grid)):
    ax[i, j].get_xaxis().set_visible(False)
    ax[i, j].get_yaxis().set_visible(False)

num_epochs = 200
num_batches = len(train_loader)
num_fig = 0

for epoch in range(num_epochs):
    for n, (images, _) in enumerate(train_loader):
        images = Variable(images)
        y_real = Variable(torch.ones(images.size(0)))

        noise = Variable(torch.randn(images.size(0), 100))
        x_fake = gen(noise)
        y_fake = Variable(torch.zeros(images.size(0),))

        d_loss, real_score, fake_score = train_discriminator(dis, images, y_real, x_fake, y_fake)

        noise = Variable(torch.randn(images.size(0), 100))
        x_fake = gen(noise)
        outputs = dis(x_fake)

        g_loss = train_generator(gen, outputs, y_real)

        if (n+1) % 100 == 0:
            test_images = gen(test_noise)
            for k in range(num_test_samples):
                i = k // 4
                j = k % 4
                ax[i, j].cla()
                ax[i, j].imshow(test_images[k,:].data.numpy().reshape(28, 28), cmap="Greys")
            display.clear_output(wait=True)
            display.display(plt.gcf())

            plt.savefig('results/%03d.png'%num_fig)
            num_fig += 1
            print('Epoch [%d/%d], Step[%d/%d], d_loss: %.4f, g_loss: %.4f, '
                  'D(x): %.2f, D(G(z)): %.2f'
                  %(epoch + 1, num_epochs, n+1, num_batches, d_loss.data[0], g_loss.data[0],
                    real_score.data.mean(), fake_score.data.mean()))

fig.close()
```

### 生成結果

![img](/images/20180328/test.gif)


* 今回使用したコードは[こちら](https://github.com/nocotan/pytorch-examples/blob/master/gan/mnist_gan.ipynb)
