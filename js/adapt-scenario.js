define(function (require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var Scenario = ComponentView.extend({
        events: {
            'click .scenario__navigator-button': 'navigateClick'
        },

        preRender: function () {
            this.model.set('_currentScenario', 0);
            this.model.set('_itemsOnStage', 0);

            this.listenTo(Adapt, 'device:resize', this.setDeviceSize, this);
            this.listenTo(Adapt, 'device:changed', this.setDeviceSize, this);
        },

        setDeviceSize: function () {
            if (Adapt.device.screenSize !== 'small') {
                this.showScenarioItems();
                this.model.set('_isDesktop', true);
                this.$el.removeClass('desktop mobile').addClass('desktop');
            } else {
                if (this.model.get('_isDesktop')) this.resetScenario();
                this.model.set('_isDesktop', false);
                this.$el.removeClass('desktop mobile').addClass('mobile');
            }
        },

        postRender: function () {
            this.setupScenario();
            this.showScenarioItems();
            this.setReadyStatus();
            this.model.set('_itemsOnStage', this.model.get('itemsOnStage'));
        },

        setupScenario: function () {
            this.setDeviceSize();
            var slideCount = this.model.get('_items').length;
            this.model.set('_itemCount', slideCount);
            this.model.set('_active', true);
            this.updateScenarioProgressBar();
        },

        navigateClick: function (event) {
            event.preventDefault();
            if (!this.model.get('_active')) return;
            var clickedButton = this.$(event.currentTarget);
            if (clickedButton.hasClass('left')) {
                if (this.model.get('_currentScenario') > 0) {
                    this.model.set('_currentScenario', this.model.get('_currentScenario') - 1);
                } else return;
            } else if (clickedButton.hasClass('right') || clickedButton.hasClass('down')) {
                if (this.model.get('_currentScenario') >= (this.model.get('_itemCount'))) {
                    return;
                } else {
                    this.model.set('_currentScenario', this.model.get('_currentScenario') + 1);
                }
            }
            this.showScenarioItems();
            this.setDeviceSize();
            this.updateScenarioProgressBar();
            this.evaluateCompletion();

            //console.log("this.model.get('_currentScenario')", this.model.get('_currentScenario'));
        },

        showScenarioItems: function () {
            if (Adapt.device.screenSize !== 'small') {
                var currentScenarioNo = this.model.get('_currentScenario') - 1,
                    container = this.$('.scenario__contanier');
                if (this.model.get('_currentScenario') == 0) {
                    container.addClass("hidden");
                } else {
                    var itemCount = (currentScenarioNo) % (this.model.get('_itemsOnStage')),
                        startIndex = 0,
                        endIndex = 0;
                    container.addClass("hidden");
                    if (itemCount == 0) container.eq(currentScenarioNo).removeClass('hidden').css({ 'opacity': 0 }).animate({ opacity: 1 });
                    else {
                        startIndex = Math.floor((currentScenarioNo) / (this.model.get('_itemsOnStage'))) * (this.model.get('_itemsOnStage'));
                        endIndex = currentScenarioNo;
                        for (var i = startIndex; i <= endIndex; i++) {
                            container.eq(i).removeClass('hidden');
                        }
                    }
                }

                $(container).eq(currentScenarioNo).a11y_focus();
            } else {
                this.$('.scenario__contanier').removeClass('hidden');
                this.setCompletionStatus();
            }
        },

        updateScenarioProgressBar: function () {
            var index = this.model.get('_currentScenario'),
                total = this.model.get('_itemCount'),
                width = (index / total) * 100;
            //this.$('.scenario__navigator-progressbar-fill').width(width + '%');
            this.$('.scenario__navigator-progressbar-fill').animate({
                width: (width + '%')
            }, 100);
            this.$('.scenario__navigator-button').removeClass('disabled').attr('aria-hidden', false).prop('disabled', false);;
            if (index == 0) {
                this.$('.scenario__navigator-button.left').addClass('disabled').attr('aria-hidden', true).prop('disabled', true);
            } else if (index == total) {
                this.$('.scenario__navigator-button.right').addClass('disabled').attr('aria-hidden', true).prop('disabled', true);;
            }

            var _progressFill = "";
            /* var _blockWidth = (100 / index) + "%";
            for (var i = 0; i < index; i++) {
                _progressFill = _progressFill + "<div class='scenario__navigator-progressbar-block-button' style='width:" + _blockWidth + "' href='javascript:void();'><div class='scenario__navigator-progressbar-block-line'></div></div>";

            } */
            this.$('.scenario__navigator-progressbar-fill').html(_progressFill);
            if (index == total) {
                /* this.$('.scenario__navigator-progressbar-block-button')
                    .eq((total - 1))
                    .html(""); */
            }
            //Set completed
            if (index == total) {
                this.setCompletionStatus();
            }
        },

        resetScenario: function () {
            if (Adapt.device.screenSize !== 'small') {
                this.model.set('_currentScenario', 0);
                this.$('.scenario__contanier').addClass("hidden");
                this.updateScenarioProgressBar();
            } else {
                this.$('.scenario__contanier').removeClass("hidden");
            }
        },

        getVisitedItems: function () {
            return _.filter(this.model.get('_items'), function (item) {
                return item.visited;
            });
        },

        evaluateCompletion: function () {
            if (this.getVisitedItems().length == this.model.get('_items').length) {
                this.setCompletionStatus();
            }
        }
    });
    Adapt.register("scenario", Scenario);
    return Scenario;
});