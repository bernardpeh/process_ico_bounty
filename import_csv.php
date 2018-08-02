<?php

$host = '127.0.0.1';
$dbname = 'ethereum';
$username = 'root';
$password = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    echo "Connected to $dbname at $host successfully.";
} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}

$csv = array_map('str_getcsv', file('data.csv'));

foreach ($csv as $row) {
  $sql = "insert into bounty (to_address,tx_id,token_value) values ('$row[1]','','$row[2]')";
  echo "$sql\n";
  if ($pdo->query($sql) === TRUE) {
    echo "New record created successfully";
  } else {
    echo $pdo->error;
  }
}
