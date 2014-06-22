'use strict';

describe('Todotail', function() {
    describe('task list', function() {

        beforeEach(function() {
            browser.get('/');
        });

        var getTasks = function () {
            return element(by.css('ol.tasks')).all(by.tagName('li'));
        };

        var addTask = function(text) {
            element(by.css('.add-task input')).sendKeys(text);
            element(by.css('.add-task button')).click();
        };

        it('should add a task to the list when the user submits the form', function() {
            var numberOfTasks = getTasks().count();
            var text = 'Testing this app at ' + new Date().getTime();
            addTask(text);

            // See that it has been added
            expect(getTasks().first().element(by.css('span.title')).getText()).toBe(text);

            // Make sure that we have more tasks now than we did before
            expect(getTasks().count()).toBeGreaterThan(numberOfTasks);
        });

        it('should be able to mark all tasks as done', function() {
            element(by.css('button.mark-all-as-complete')).click();
            element.all(by.css('ol.tasks input[type=checkbox]')).each(function(checkbox) {
                expect(checkbox.getAttribute('checked')).toBeTruthy();
            });
        });

        it('should be able to delete all completed tasks', function() {
            var numberOfTasks = getTasks().count();
            element(by.css('.delete-done')).click();

            //Just to make sure that we had tasks to begin with
            expect(getTasks().count()).toBeLessThan(numberOfTasks);

            expect(getTasks().count()).toBe(0);
        });

        it('should count the number of remaining tasks', function() {
            addTask('Testing count at ' + new Date().getTime());
            addTask('Testing count at ' + new Date().getTime());

            getTasks().count().then(function(count) {
                expect(element(by.css('.count')).getText()).toBe(count + ' items left');
            });
        })
    });
});