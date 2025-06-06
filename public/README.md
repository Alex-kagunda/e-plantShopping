# E-PlantShopping - Paradise Nursery

A vanilla HTML, CSS, and JavaScript front-end for a fictional "Paradise Nursery" plant shopping application.

## Project Overview

This application allows users to browse a variety of houseplants, add them to a shopping cart, and manage items in their cart before a simulated checkout.

## Pages

1.  **Landing Page (`public/index.html`)**:
    *   Background image.
    *   Company name and a brief paragraph about the company.
    *   "Get Started" button linking to the product listing page.

2.  **Product Listing Page (`public/products.html`)**:
    *   Header with navigation and a dynamic shopping cart icon (displaying total item count).
    *   Displays at least six houseplants, organized into three or more categories.
    *   Each plant shows:
        *   Thumbnail image
        *   Plant name
        *   Price
        *   "Add to Cart" button.

3.  **Shopping Cart Page (`public/cart.html`)**:
    *   Header with navigation and dynamic shopping cart icon.
    *   Displays total number of plants and total cost.
    *   Lists each type of plant in the cart with:
        *   Thumbnail image and name.
        *   Unit price.
        *   Increase/decrease quantity buttons.
        *   Delete button for each plant type.
    *   "Continue Shopping" button (links to product page).
    *   "Checkout" button (simulates checkout, clears cart).

## Technologies Used

*   HTML5
*   CSS3 (with CSS Variables)
*   JavaScript (ES6+) - (DOM Manipulation, Local Storage for cart persistence)

## File Structure

The project aims to mimic a basic React-like structure for organizational purposes: