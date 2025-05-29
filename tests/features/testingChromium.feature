@test_google_chrome_desktop
Feature: ToDo List

  Background:
    Given I open the ToDo web app at "http://localhost:5173"
    When I visit the homepage

  Scenario: Viewing the Home Page
    Then I should see "Todo List"
    And the page should load successfully

  Scenario: Adding a New ToDo
    When I add a new task
    Then I should see the new task appear in my list

  Scenario: Filtering Completed ToDos
    When I add a new task
    And I mark the task as completed
    Then I should see it listed under "Completed"
