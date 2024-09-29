<?php
class Scraper {
    private $url;
    private $html;

    public function __construct() {
        if (file_exists("./url.txt")) {
            $this->url = trim(file_get_contents("./url.txt"));
            $this->html = file_get_contents($this->url);
        } else {
            throw new Exception("File url.txt not found");
        } 
    }


    public function extractProduct() {
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($this->html);
        libxml_clear_errors();
    
        $xpath = new DOMXPath($dom);
        $products = $xpath->query('//div[contains(@class, "api product-list-item") and @widget]');

        $productsArray = array();
        
        foreach ($products as $product) {
            $href = $xpath->query('.//a[@class="cover-link"]', $product)->item(0)->getAttribute('href');
            $urlParts = explode('/', $href);
            $categoryName = $urlParts[4];
            $title = trim($xpath->query('.//p/a', $product)->item(0)->nodeValue); // Use trim() to remove extra whitespace
        
            // Get the price and discount price
            $priceDiv = $xpath->query('.//div[@class="c-price h-price--small"]', $product);
            $price = trim($priceDiv->item(0)->nodeValue);
            
            if ($price == null){
                $priceDiv = $xpath->query('.//div/span[@class="price notranslate "]', $product);
                $price = trim($priceDiv->item(0)->nodeValue);
            }

            if ($price == null){
                $priceDiv = $xpath->query('.//span[@class="old-price"]', $product);
                $price = trim($priceDiv->item(0)->nodeValue);
            }

            $price = str_replace(' €', '', $price); // Remove the euro sign
            $price = number_format((float) str_replace('.', '', $price) / 100, 2, '.', ''); // Format the price

            $discountPriceDiv = $xpath->query('.//span[@class="price notranslate discount-price"]', $product);

            $discountPrice= trim($discountPriceDiv->item(0)->nodeValue);

            $discountPrice = str_replace(' €', '', $discountPrice); // Remove the euro sign
            $discountPrice = number_format((float) str_replace('.', '', $discountPrice) / 100, 2, '.', ''); // Format the price

            if ($title && $categoryName) {
                $productsArray[] = array(
                    'title' => $title,
                    'category' => $categoryName,
                    'price' => $price,
                    'discountPrice' => $discountPrice
                );
            }
        }

        return $productsArray;
    }

    public function extractCategories() {
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($this->html);
        libxml_clear_errors();
    
        $xpath = new DOMXPath($dom);
        $products = $xpath->query('//div[contains(@class, "api product-list-item") and @widget]');

        $productsArray = array();
        
        foreach ($products as $product) {
            $href = $xpath->query('.//a[@class="cover-link"]', $product)->item(0)->getAttribute('href');
            $urlParts = explode('/', $href);
            $categoryName = $urlParts[4];
            $title = trim($xpath->query('.//p/a', $product)->item(0)->nodeValue); // Use trim() to remove extra whitespace
        
            if ($title && $categoryName) {
                $productsArray[] = array(
                    'title' => $title,
                    'category' => $categoryName
                );
            }
        }

        return $productsArray;
    }
}

$check = new Scraper();
$check->extractProduct();