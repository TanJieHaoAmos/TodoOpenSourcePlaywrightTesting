@chromium
Feature: ToDo List

  Background:
    Given I am on the homepage

  Scenario: Accessing ToDo HomePage
    Then I should see ToDo
    Then the response status code should be 200

  Scenario: Adding ToDo
    When I add a ToDo
    Then I should see ToDo added

  Scenario: Filtering ToDo
    When I add a ToDo
    And I complete the ToDo
    Then I should see the ToDo under Completed

