---
title: Images
---
## Introduction

Because the length of copy is, usually, the biggest variable between different designs made from the same template, the bulk of the SpreadsheetAi script's functionality attempts to address text reflowing and resizing.

## Size option

Images have three sizing options: `cover`, `contain`, and `original`

The `cover` and `contain` options act like the same words in css. `cover` will size the image to fill the container with minimum overflow while `contain` will size the image to be as large as possible while fitting completely within the container. `original`, on the other hand, will not size the image at all however the image will still be masked to the size and shape of the container.

![](../../images/image-sizing-2.jpg)
_All size options demoed. First with a large landscape image and second with a small portrait image._