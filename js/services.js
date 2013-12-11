angular.module('langtonsant.services', [])
.service('simulationService', function($document) {

        //  The rendering service really only cares about the canvas
        //  and sim in terms of state..
        this.canvas = null;
        this.simulation = new LangtonsAnt();;
        $document.ready(function() {
           this.canvas = document.getElementById('antcanvas');
        });

        this.render = function() {
            if(this.canvas !== null && this.canvas !== undefined) {
                this.simulation.render(this.canvas);
            }
        };

    });