<?php
require_once 'Scraper.php';

// Configuration
$api_key = 'YOUR_API_KEY';
$username = 'YOUR_USERNAME';
$password = 'YOUR_PASSWORD';

// API endpoint
$api = new \Slim\App();

$app->post('/scrape', function ($request, $response) use ($api_key, $username, $password) {
    // Verify API key
    $provided_api_key = $request->getHeader('API-KEY');
    if ($provided_api_key !== $api_key) {
        return $response->withStatus(401)->withJson(['error' => 'Invalid API key']);
    }

    // Verify user credentials
    $auth = $request->getHeader('Authorization');
    if (!$auth) {
        return $response->withStatus(401)->withJson(['error' => 'Unauthorized']);
    }
    list($username_provided, $password_provided) = explode(':', base64_decode(substr($auth, 6)));
    if ($username_provided !== $username || $password_provided !== $password) {
        return $response->withStatus(401)->withJson(['error' => 'Invalid credentials']);
    }

    // Get the URL to scrape from the request body
    $url = $request->getParam('url');
    if (!$url) {
        return $response->withStatus(400)->withJson(['error' => 'URL is required']);
    }

    // Create a new Scraper instance
    $scraper = new Scraper($url);

    // Scrape the webpage
    $products = $scraper->extractProduct();

    // Return the results in JSON format
    return $response->withJson($products);
});

$app->run();