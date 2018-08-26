import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'AnalyticsApplicationCustomizerStrings';

const LOG_SOURCE: string = 'AnalyticsApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAnalyticsApplicationCustomizerProperties {
  trackingID: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class AnalyticsApplicationCustomizer
  extends BaseApplicationCustomizer<IAnalyticsApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    this.AttachNavigatedEvent();
    let trackingID: string = this.properties.trackingID;
    if (!trackingID) {
      Log.info(LOG_SOURCE, `${strings.MissingID}`);
    }else{
      var gtagScript = document.createElement("script");
      gtagScript.type = "text/javascript";
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingID}`;    
      gtagScript.async = true;
      document.head.appendChild(gtagScript);  

      eval(`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());    
        gtag('config',  '${trackingID}');
      `);
    }

    return Promise.resolve();
  }

  public AttachNavigatedEvent(){
    let trackingID: string = this.properties.trackingID;
    this.context.application.navigatedEvent.add(this, () => {
      eval(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config',  '${trackingID}');
    `);
    console.log("accessing from navigated event");
    });
  }
}
