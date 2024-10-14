# Le Creuset Stock Data Parser 📦

A data parser used for the Le Creuset Portsmouth team to easily read / quantify the items needed for re-ordering stockevery day.

[Link to Website](https://derek-walton.github.io/Le-Creuset-Stock-Counter/)

## Table of contents
- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How it Works](#how-it-works)
- [Case Examples](#case-examples)

## Overview

This small project was developed to help the Le Creuset Portsmouth Shop __easily quantify__ and __read__ the data produced by their replenishment (re-ordering) software. while the current replenishment software was undergoing maintanence for a few weeks.

## The Problem

The current software their shop uses to manually re-order stock, was developed in 2007, and the interface is very out-dated and complicated.

They're required to re-order stock Sunday - Friday, When re-ordering new stock, it was hard to quantify / understand how many of each product was needed, as the 2007 software creates a new row after every purchase.

## The Solution

Instead of having to navigate through the out-dated software, manually keeping track of each item, the team was now able to simply copy the data, then paste it into the data parser and have quantified, human readable results where you could tick off each row as you go.

This made manually re-ordering stock, easier and simplier for the team  

## How it Works

The stock counter takes the copied data as plain text as it's input, and formats / parse the data by:
-   Removing the unnecessary collums, e.g. Product ID, Date Purchased, Store Number and Product Price,
-   Quantifies each product,
-   Sorts it alphabetically,
-   Adds a check box

Test case data available [here](test-case.txt)

## Case Examples

<img width="1710" alt="image" src="https://github.com/user-attachments/assets/075a72bd-f342-4a18-8c22-e9c1ec89f713">

<img width="1710" alt="image" src="https://github.com/user-attachments/assets/350b282d-e4d3-4b1d-88a8-0b188d5ec057">

<img width="1710" alt="image" src="https://github.com/user-attachments/assets/bc085dd6-8896-4c81-915a-47c4680d0ad4">

### Note

As this was only a temporary solution that would last a few weeks, there wasn't much of an importance to optimise the parser and polish the user interface, as the main focus was to get a working prototype up and running for the team.
