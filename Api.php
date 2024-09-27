<?php
require_once 'Scraper.php';

// Load the list of e-commerce website URLs from a text file
$urls = file('urls.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

// Create an instance of the Scraper class
$scraper = new Scraper();

// Initialize an empty array to store the results
$results = array();

// Loop through each URL and scrape the homepage
foreach ($urls as $url) {
    try {
        // Create a new instance of the Scraper class for each URL
        $scraper = new Scraper($url);
        $products = $scraper->extractProduct();
        $results[] = array(
            'url' => $url,
            'products' => $products
        );
    } catch (Exception $e) {
        // Handle any errors that occur during scraping
        error_log("Error scraping $url: " . $e->getMessage());
    }
}

// Return the results in JSON format
header('Content-Type: application/json');
echo json_encode($results);