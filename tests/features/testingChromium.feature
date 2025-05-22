@chromium
Feature: ToDo List

  Background:
    Given I am on the homepage

  Scenario: Accessing ToDo HomePage
    Then I should see ToDo

  Scenario: Adding ToDo
    When I add a ToDo
    Then I should see ToDo added
