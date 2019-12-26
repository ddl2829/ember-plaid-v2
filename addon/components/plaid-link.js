/* global Plaid:false */
// Sets Plaid as a global read-only variable for eslint

import Component from "@ember/component";
import layout from "../templates/components/plaid-link";

const OPTIONS = [
  "clientName",
  "env",
  "key",
  "product",
  "webhook",
  "token",
  "selectAccount"
];
const DEFAULT_LABEL = "Link Bank Account"; // Displayed on button if no block is passed to component

export default Component.extend({
  layout,
  tagName: "button",
  label: DEFAULT_LABEL,

  // Link action Parameters to pass into component via view
  onSuccess() {},
  onOpen() {},
  onLoad() {},
  onExit() {},
  onError() {},

  // Link Parameters to pass into component via config file
  // Complete documentation: https://plaid.com/docs/api/#parameter-reference
  clientName: null,
  env: null,
  key: null,
  product: null,
  webhook: null,
  token: null,

  // Private
  _link: null,

  // TODO: Implement onEvent callback

  init() {
    this._super(...arguments);
    const options = Object.assign(this.getProperties(OPTIONS), {
      onLoad: this._onLoad.bind(this),
      onSuccess: this._onSuccess.bind(this),
      onExit: this._onExit.bind(this)
    });

    return new Ember.RSVP.Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
      script.onload = resolve;
      script.onerror = reject;
      document.getElementsByTagName("head")[0].appendChild(script);
    })
      .then(() => {
        this._link = window.Plaid.create(options);
      })
      .catch(() => {
        this.get("_onError")();
      });
  },

  click() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    this.send("clicked");
    this._link.open();
  },

  _onError() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    this.send("errored");
  },

  _onLoad() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    this.send("loaded");
  },

  _onExit: function(error, metadata) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    this.send("exited", error, metadata);
  },

  _onSuccess: function(token, metadata) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    this.send("succeeded", token, metadata);
  },

  actions: {
    // Send closure actions passed into component

    clicked() {
      this.get("onOpen")();
    },

    loaded() {
      this.get("onLoad")();
    },

    exited(error, metadata) {
      this.get("onExit")(error, metadata);
    },

    errored() {
      this.get("onError")();
    },

    succeeded(token, metadata) {
      this.get("onSuccess")(token, metadata);
    }
  }
});
