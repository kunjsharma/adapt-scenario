define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var Handlebars = require('handlebars');
    var Scenario = ComponentView.extend({
        events: {
            'click .scenario-navigator-button': 'navigateClick'
        },
        preRender: function() {
            //OUR HBS template requires this helper
            if (Handlebars.helpers && !('ifvalue' in Handlebars.helpers)) {
                Handlebars.registerHelper('ifvalue', function (conditional, options) {
                    if (options.hash.value === conditional) {
                        return options.fn(this)
                    } else {
                        return options.inverse(this);
                    }
                });
            }
            this.model.set('_currentScenario', 0);
            this.model.set('_itemsOnStage', 0);

            this.listenTo(Adapt, 'device:resize', this.setDeviceSize, this);
            this.listenTo(Adapt, 'device:changed', this.setDeviceSize, this);
            
          
        },
        setDeviceSize: function() {
            if (Adapt.device.screenSize !== 'small') {
                //if (!this.model.get('_isDesktop')) this.resetScenario();
                this.showScenarioItems();
                this.model.set('_isDesktop', true);
                this.$el.removeClass('desktop mobile').addClass('desktop');
            } else {
                if (this.model.get('_isDesktop')) this.resetScenario();
                this.model.set('_isDesktop', false);
                this.$el.removeClass('desktop mobile').addClass('mobile');
            }
        },
        postRender: function() {
            this.setupScenario();
            this.showScenarioItems();
            this.setReadyStatus();
            this.model.set('_itemsOnStage', this.model.get('itemsOnStage'));
        },
        setupScenario: function() {
            this.setDeviceSize();
            var slideCount = this.model.get('items').length;
            this.model.set('_itemCount', slideCount);
            this.model.set('_active', true);
            this.updateScenarioProgressBar();
        },
        navigateClick: function(event) {
            event.preventDefault();
            if (!this.model.get('_active')) return;
            var $target = this.$(event.currentTarget);
            if ($target.hasClass('left')) {
                if (this.model.get('_currentScenario') > 0) {
                    this.model.set('_currentScenario', this.model.get('_currentScenario') - 1);
                } else return;
            } else if ($target.hasClass('right') || $target.hasClass('down')) {
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
            
            console.log("this.model.get('_currentScenario')", this.model.get('_currentScenario'));
        },
        showScenarioItems: function() {
            if (Adapt.device.screenSize !== 'small') {
                var currentScenarioNo = this.model.get('_currentScenario') - 1,
                $container = this.$('.scenario-contanier');
                if (this.model.get('_currentScenario') == 0) {
                    $container.addClass("hidden");
                } else {
                    var itemCount = (currentScenarioNo) % (this.model.get('_itemsOnStage'));
                    var startIndex = 0;
                    var endIndex = 0;
                    $container.addClass("hidden");
                    if (itemCount == 0) $container.eq(currentScenarioNo).removeClass('hidden').css({'opacity': 0}).animate({opacity: 1});
                    else {
                        startIndex = Math.floor((currentScenarioNo) / (this.model.get('_itemsOnStage'))) * (this.model.get('_itemsOnStage'));
                        endIndex = currentScenarioNo;
                        for (var i = startIndex; i <= endIndex; i++) {
                            $container.eq(i).removeClass('hidden');
                        }
                    }
                }
            
                $($container).eq(currentScenarioNo).a11y_focus();
            } else {
                this.$('.scenario-contanier').removeClass('hidden');
                this.setCompletionStatus();
            }
        },
        updateScenarioProgressBar: function() {
             var index = this.model.get('_currentScenario'),
                total = this.model.get('_itemCount'),
                _nWidth = (index / total) * 100;
            //this.$('.scenario-navigator-progressbar-fill').width(_nWidth + '%');
            this.$('.scenario-navigator-progressbar-fill').animate({
                width: (_nWidth + '%')
            }, 100);
            this.$('.scenario-navigator-button').removeClass('disabled').attr('aria-hidden', false).prop('disabled', false);;
            if(index == 0) {
                this.$('.scenario-navigator-button.left').addClass('disabled').attr('aria-hidden', true).prop('disabled', true);
            } else if(index == total) {
                this.$('.scenario-navigator-button.right').addClass('disabled').attr('aria-hidden', true).prop('disabled', true);;
            }
            
            var _progressFill = "";
            /* var _blockWidth = (100 / index) + "%";
            for (var i = 0; i < index; i++) {
                _progressFill = _progressFill + "<div class='scenario-navigator-progressbar-block-button' style='width:" + _blockWidth + "' href='javascript:void();'><div class='scenario-navigator-progressbar-block-line'></div></div>";

            } */
            this.$('.scenario-navigator-progressbar-fill').html(_progressFill);
            if (index == total) {
                /* this.$('.scenario-navigator-progressbar-block-button')
                    .eq((total - 1))
                    .html(""); */
            }
            //Set completed
            if (index == total) {
                this.setCompletionStatus();
            }
        },
        resetScenario: function() {
            if (Adapt.device.screenSize !== 'small') {
                this.model.set('_currentScenario', 0);
                this.$('.scenario-contanier').addClass("hidden");
                this.updateScenarioProgressBar();
            } else {
                this.$('.scenario-contanier').removeClass("hidden");
            }
        },

        getVisitedItems: function() {
            return _.filter(this.model.get('items'), function (item) {
                return item.visited;
            });
        },
        evaluateCompletion: function() {
            if (this.getVisitedItems().length == this.model.get('items').length) {
                this.setCompletionStatus();
            }
        }
    });
    Adapt.register("scenario", Scenario);
    return Scenario;
});