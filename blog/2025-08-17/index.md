---
slug: demo-app
title: Demo.Overturemapsapi.com is Live!
authors: [adenforshaw]
tags: [thatapicompany, api-key, endpoints, demo]
---

## Building an Interactive Places Explorer with Overture Maps API

We're excited to share a new open-source demo that showcases the power and simplicity of the Overture Maps API: the World Places Demo. This interactive map application demonstrates how developers can quickly build location-aware applications using our comprehensive places dataset.

## [https://Demo.Overturemapsapi.com](https://Demo.Overturemapsapi.com)

## What We Built

The Overture Maps World Places Demo is a full-featured mapping application that lets users explore millions of places worldwide. Built with modern web technologies (Next.js 14, TypeScript, and MapLibre GL JS), it provides an intuitive interface for discovering restaurants, shops, pharmacies, and other points of interest anywhere on Earth.


![Docusaurus Plushie](./site-screenshot.png)

Overture Maps World Places Demo

## Key Features That Showcase Our API

- **Smart Filtering**: Users can filter by categories (food, retail, healthcare, etc.) and specific brands, with results updating dynamically based on location and context.

- **Real-time Search**: The app automatically searches for places as users move the map, or they can manually trigger searches with customizable radius and result limits.

- **Rich Place Data**: Each place includes detailed information like confidence scores, addresses, categories, and brand affiliations—all sourced from Overture's high-quality dataset.

- **Developer-Friendly**: The codebase demonstrates best practices for API integration, including proper error handling, TypeScript support, and flexible schema validation.

## API Design Highlights

The demo showcases our API's developer-friendly design:

- **Clean JSON Format**: We've moved to a cleaner JSON response format that's easier to work with than traditional GeoJSON:

- **Flexible Parameters**: Search by location, radius, categories, brands, and more—all with sensible defaults and clear documentation.

- **Built for Scale**: Support for up to 25,000 results per query with efficient filtering and pagination.

## Try It Yourself

Ready to explore? Visit the [live demo](https://demo.overturemapsapi.com) and start discovering places around the world. The application defaults to showing pharmacies near New York City, but you can explore any location and category combination.

**For Developers**: Clone the [GitHub repository](https://github.com/thatapicompany/overture-maps-world-places-demo) to see how we built it. The codebase includes:

- Complete TypeScript definitions for all API responses
- Zod schema validation for type safety
- Error handling best practices
- Responsive design patterns

## Get Started with Overture Maps API

Want to build your own location-aware application? Getting started is simple:

1. Get your free API key at [account.overturemapsapi.com](https://account.overturemapsapi.com)
2. Explore our endpoints: Places search, categories, brands, and countries
3. Check the documentation and use our demo as a reference implementation

Whether you're building a store locator, travel app, or business intelligence tool, the Overture Maps API provides the comprehensive, high-quality places data you need—with a developer experience designed for modern applications.

Start exploring at [overturemapsapi.com](https://overturemapsapi.com) and see what you can build!
