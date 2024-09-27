<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Accept, Accept-Language, Accept-Encoding');

require_once 'Scraper.php';

// Initialize an empty array to store the results
$results = array();

try {
    // Create a new instance of the Scraper class for each URL
    $scraper = new Scraper('urls.txt');
    $results = $scraper->extractProduct();
} catch (Exception $e) {
    // Handle any errors that occur during scraping
    error_log("Error scraping: " . $e->getMessage());
    $results = array('error' => $e->getMessage());
}

// Return the results in JSON format
header('Content-Type: application/json');
echo json_encode($results);
?>