<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Accept, Accept-Language, Accept-Encoding');

require_once '../Scraper.php';

// Initialize an empty array to store the results
$results = array();

// User authentication
$username = 'admin';
$password = 'password'; // Store hashed password in a secure database
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Check if the user has provided authentication credentials
if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
    header('WWW-Authenticate: Basic realm="Scraper Authentication"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Unauthorized';
    exit;
}

// Verify the provided credentials
if ($_SERVER['PHP_AUTH_USER'] !== $username || !password_verify($_SERVER['PHP_AUTH_PW'], $hashedPassword)) {
    header('WWW-Authenticate: Basic realm="Scraper Authentication"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Invalid username or password';
    exit;
}

try {
    // Create a new instance of the Scraper class for each URL
    $scraper = new Scraper();
    $results = $scraper->extractCategories();
} catch (Exception $e) {
    // Handle any errors that occur during scraping
    error_log("Error scraping: " . $e->getMessage());
    $results = array('error' => $e->getMessage());
}

// Return the results in JSON format
header('Content-Type: application/json');
echo json_encode($results);
?>