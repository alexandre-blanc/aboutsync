"use strict";
const React = require("react");
const { toast, toast_error } = require('./common');
const PropTypes = require("prop-types");

class EngineActions extends React.Component {

  static get propTypes() {
    return {
      engine: PropTypes.object.isRequired,
      records: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  reset(event) {
    let e = this.props.engine;
    e._log.info("about:sync resetting engine due to user request");
    e.resetClient().then(() => {
      toast("Reset complete");
    }).catch(err => {
      toast_error("Failed to reset the engine", err);
    });
  }

  bookmark(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const device_id = Object.fromEntries(data.entries()).device;
    const record = this.props.records.filter(r => r.id == device_id)[0];
    const tabs = record.tabs
    const device = record.clientName
    console.log(device)
    console.log(tabs)
    console.log("hey")
    console.log(browser.runtime.sendMessage).catch(e => console.log(e))
    browser.runtime.sendMessage({
      device:device,
      tabs:tabs
    }).catch(e => console.log(e))
    // console.log(browser.bookmarks.create({}))
    // let createBookmark = browser.bookmarks.create({
    //   title: "bookmarks.create() on MDN",
    //   url: "https://developer.mozilla.org/Add-ons/WebExtensions/API/bookmarks/create",
    // }).catch((error) => console.error(error));
    console.log("ho")
    // .then(treeNode => {
    //   for (const [i, tab] of tabs.entries()){
    //     browser.bookmarks.create({
    //       "index":i,
    //       "parentId":treeNode,
    //       "title":tab.title,
    //       "url":tab.urlHistory[0]
    //     });
    //   }
    // });
  }
  wipe(event) {
    let e = this.props.engine;
    e._log.info("about:sync wiping engine due to user request");
    e.wipeServer().then(() => {
      toast("Wipe complete");
    }).catch(err => {
      toast_error("Failed to wipe the engine", err);
    });
  }

  render() {
    let bookmark;
    if (this.props.engine.name == 'tabs'){
      console.log(this.props.records)
      const devices = []
      for (const device of this.props.records){
        devices.push(
          <option key={device.id} value={device.id}>{device.clientName}</option>
        )
      }
      bookmark =
        <div className="horiz-action-row">
          <form method="post" onSubmit={this.bookmark.bind(this)}>
            <label>Bookmark tabs from 
              <select name="device" id ="device">
                {devices}
              </select>
            </label>
            <button type="submit"> Go </button>
          </form>
        </div>
    }

    let reset;
    if (this.props.engine.resetClient) {
      reset =
        <div className="horiz-action-row">
          <span>Resetting an engine clears all local state, so the next Sync will
                act as though this was the first sync for that engine's data -
                all records will be downloaded, compared against local records
                and missing records uploaded
          </span>
          <button onClick={event => this.reset(event)}>Reset {this.props.engine.name}</button>
        </div>
    }
    let canWipe = !["crypto", "meta"].includes(this.props.engine.name);
    let wipe;
    if (canWipe) {
      wipe =
        <div className="horiz-action-row">
          <span>Wiping an engine removes data from the server. <em>It does not remove local data</em>.
                This device will upload all its data. Other devices will act like a <i>Reset</i>, as described above.
          </span>
          <button onClick={event => this.wipe(event)}>Wipe {this.props.engine.name}</button>
        </div>
    };
    return (
      <>
      { bookmark }
      { reset }
      { wipe }
    </>
  );
  }
}

module.exports = { EngineActions };
