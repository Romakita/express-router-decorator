import {Type} from "@tsed/core";
import {Adapter} from "./Adapter";

export interface AdaptersSettings {
  /**
   * Injectable service to manage database connexion
   */
  Adapter?: Type<Adapter>;
  /**
   *
   */
  lowdbDir?: string;
}

declare global {
  namespace TsED {
    interface Configuration {
      adapters: AdaptersSettings;
    }
  }
}
