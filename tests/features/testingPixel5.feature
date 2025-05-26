@pixel5
Feature: ToDo List

  Background:
    # Given I am on the homepage
    Given I have a web server URL "http://localhost:5173"
    When I attempt to access the web server

  Scenario: Accessing ToDo HomePage
    Then I should see ToDo
    And the response status code should be 200

  Scenario: Adding ToDo
    And I add a ToDo
    Then I should see ToDo added

  Scenario: Filtering ToDo
    And I add a ToDo
    And I complete the ToDo
    Then I should see the ToDo under Completed

  
