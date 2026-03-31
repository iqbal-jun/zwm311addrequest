sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zwm311countingrequest/test/integration/FirstJourney',
		'zwm311countingrequest/test/integration/pages/StocksMain'
    ],
    function(JourneyRunner, opaJourney, StocksMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zwm311countingrequest') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStocksMain: StocksMain
                }
            },
            opaJourney.run
        );
    }
);