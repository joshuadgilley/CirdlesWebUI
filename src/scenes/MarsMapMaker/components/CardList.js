///////////////////////////////////////////////////////////////////////////////////
// CARDLIST.JS ///////////////////////////////////////////////////////////////////
// This component takes data from App.js and creates the cards displayed in UI //
// Renders and creates the toolbar and the fieldCards displayed in UI //////////
///////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// COMPONENTS

import FieldCard from "./FieldCard";

import HeaderFieldCard from "./cardListMenu/HeaderFieldCard";

import CardListMenu from "./cardListMenu/CardListMenu";
// CSS & Style
import "../../../styles/marsMapMaker.scss";

// REDUX
import { firstState, toggleInUse } from "../../../actions/marsMapMaker";

// helper functions && constants
import { MULTI_VALUE_TITLES as MVT } from "../util/constants";

///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

const CardList = props => {
  // global variables for the Object Array the Redux Store is built on along with the id accumulator

  const objArray = [];
  const useOnce = [];
  let newKey = -1;

  const [lastMetaDataAdd, incrementMetaDataAdd] = useState(3);
  const [fieldsState, addAFieldCardHead] = useState(props.fields);

  const [fieldValState, addAFieldCardVal] = useState(props.fieldVal);

  // used to toggle between the tuples of the csv loaded in
  const [toggleIndex, addToToggleIndex] = useState(1);

  // maps through fields and creates unique field card entry for each
  // hiding: value to hide entry or not
  // fieldTitle: column attribute of an entry
  // fieldType: defines if content is number or text
  // fieldValue: the content of an column attribute
  // hasContent: for initial filtering of checked cards
  // goes to the next row of content in the csv

  const downArrowToggle = () => {
    if (toggleIndex < props.tValLength) {
      addToToggleIndex((toggleIndex + 1) % props.tValLength);
      let obj = {
        bool: true
      };
      props.toggleInUse(obj);
    }
  };

  // goes to the previous row of content in the csv
  const upArrowToggle = () => {
    if (toggleIndex > 1) {
      addToToggleIndex((toggleIndex - 1) % props.toggleArr.length);
      let obj = {
        bool: true
      };
      props.toggleInUse(obj);
    }
    console.log(props.jsFileValues);
  };

  // returns to the first row of content in the csv
  const refreshButton = () => {
    addToToggleIndex(1);
    let obj = {
      bool: true
    };
    props.toggleInUse(obj);
  };

  // if a map (js) file is passed in, it searches for previous selections made to update the Redux store accordingly
  const findSesarPassIn = field => {
    let sesarPassIn = "";
    if (props.jsFileValues !== undefined) {
      for (let i = 0; i < props.jsFileValues.length; i++) {
        if (
          props.jsFileValues[i][1] !== undefined &&
          field === props.jsFileValues[i][1].replace(" ", "")
        ) {
          sesarPassIn = props.jsFileValues[i][0];
        }
      }
    }
    return sesarPassIn;
  };

  const valueIsInJsMappingFile = field => {
    let valid = false;
    if (props.jsFileValues !== undefined) {
      for (let i = 0; i < props.jsFileValues.length; i++) {
        if (props.jsFileValues[i][1] === field) valid = true;
      }
    }
    return valid;
  };

  const storeLoad = (ents, toggles) => {
    return ents.length > 0 && toggles.length > 0;
  };

  // maps content to separate fieldcards on the screen
  const fields = fieldsState.map(field => {
    newKey += 1;
    let storedValue = {};
    let sesarFind = findSesarPassIn(field);
    let fieldContentValue;
    let forcedIndex = -1;

    //hardcoded <METADATA_ADD> number 4
    //if metadata add else find where metadata index is
    if (newKey < 4 && props.jsFileValues !== undefined) {
      sesarFind = props.forceValues[newKey];
      forcedIndex = newKey;
    } else {
      forcedIndex = props.forceTitles.indexOf(field);
    }

    //if not metadata or metadata add
    if (forcedIndex === -1) {
      storedValue = {
        id: newKey,
        sesarTitle: sesarFind,
        oldValue: fieldValState[newKey],
        value: fieldValState[newKey],
        // this used to be id
        header: field,
        isDate: false,
        isMeasurement: false,
        isGreen: fieldValState[newKey] !== "" || valueIsInJsMappingFile(field)
      };
      fieldContentValue = fieldValState[newKey];
    } else {
      //if metadata
      if (newKey > lastMetaDataAdd) {
        storedValue = {
          id: newKey,
          sesarTitle: sesarFind,
          oldValue: fieldValState[newKey],
          value: props.forceValues[forcedIndex],
          // this used to be id
          header: "<METADATA>",
          isDate: false,
          isMeasurement: false,
          isGreen: fieldValState[newKey] !== "" || valueIsInJsMappingFile(field)
        };
        fieldContentValue = props.forceValues[forcedIndex];
      } else {
        if (
          newKey < props.persist.length &&
          props.persist[newKey].isMetaDataAdd
        ) {
          storedValue = {
            id: newKey,
            sesarTitle: props.persist[newKey].sesar,
            oldValue: fieldValState[newKey],
            value: props.forceValues[forcedIndex],
            // this used to be id
            header: "<METADATA_ADD>",
            isDate: false,
            isMeasurement: false,
            isGreen:
              fieldValState[newKey] !== "" || valueIsInJsMappingFile(field)
          };
        } else {
          storedValue = {
            id: newKey,
            sesarTitle: "",
            oldValue: fieldValState[newKey],
            value: props.forceValues[forcedIndex],
            // this used to be id
            header: "<METADATA_ADD>",
            isDate: false,
            isMeasurement: false,
            isGreen:
              fieldValState[newKey] !== "" || valueIsInJsMappingFile(field)
          };
        }
        fieldContentValue = props.forceValues[forcedIndex];
      }
    }

    // after object is created, append it to the object array & add one to the ID
    useOnce.push("");
    objArray.push(storedValue);

    // create the FieldCard that you see in the UI
    // If toggleIndex is 0 then we're on the 1st row so give it raw input
    // Else give it the object.values..
    // Meaning refer to Sample Row array created in store
    if (storeLoad(props.ent, props.toggleArr)) {
      if (toggleIndex === 1) {
        return (
          <FieldCard
            jsFileValues={props.jsFileValues}
            hiding={props.hide}
            fieldTitle={field}
            id={newKey}
            fieldValue={Object.values(props.toggleArr[toggleIndex])[newKey]}
            hasContent={
              props.fieldVal[newKey] !== "" || valueIsInJsMappingFile(field)
            }
          />
        );
      } else
        return (
          <FieldCard
            jsFileValues={props.jsFileValues}
            hiding={props.hide}
            fieldTitle={Object.keys(props.toggleArr[toggleIndex])[newKey]}
            id={newKey}
            fieldValue={Object.values(props.toggleArr[toggleIndex])[newKey]}
            hasContent={
              props.fieldVal[newKey] !== "" ||
              valueIsInJsMappingFile(
                Object.keys(props.toggleArr[toggleIndex])[newKey]
              )
            }
          />
        );
    }
  });

  // uses the action "firstState" with the argument "objArray" to create the Redux Store ***ONE TIME***
  useEffect(() => {
    const initObj = {
      objArr: objArray,
      useOnce: useOnce
    };
    props.firstState(initObj);
  }, []);

  // This helper function fills the multiValueArray where each index represents the "field_name", "description", or "sample_comment" selections
  const multiValueArrHelper = (options, index, multiArr) => {
    let j;
    for (j = 0; j < 3; j++) {
      if (options.indexOf(props.ent[index].sesarTitle) !== -1) {
        if (props.ent[index].value !== "") {
          multiArr[options.indexOf(props.ent[index].sesarTitle)].push(
            props.ent[index].header + ":" + props.ent[index].value
          );
          break;
        } else {
          multiArr[options.indexOf(props.ent[index].sesarTitle)].push(
            props.ent[index].header + ":NO_DATA"
          );
          break;
        }
      }
    }
  };

  // Helper function add the "field_name", "description", "sample_comment" title to the beginning of the join(";") array index
  const appendTitleToFront = (multiValueArr, options) => {
    let i;
    for (i = 0; i < 5; i++) {
      if (multiValueArr[i] !== "" && multiValueArr[i] !== undefined)
        multiValueArr[i] = options[i] + " ==> " + multiValueArr[i];
    }
  };

  ////////// Shows (Map Preview / Size Selection Preview / Multi-Value Selections )
  const previewPopUp = () => {
    console.log("you rang");
    ////////////////
    // POP-UP LOCAL VARIABLES
    let multiValueArr = [[], [], [], [], []];
    let mapPreviewArr = [];
    let fieldIndex = -1;
    let descripIndex = -1;
    let sampleIndex = -1;
    let geoIndex = -1;
    let sizeIndex = -1;
    let finalMap;
    let finalArray;
    let arr = [];
    let i;

    /////////////////////////////////////////////////////////
    /////////// Display Preview of Multi-Value Selections
    for (i = 0; i < props.ent.length; i++) {
      if (props.ent[i].sesarTitle !== "") {
        mapPreviewArr.push(
          String(props.ent[i].sesarTitle + ":" + props.ent[i].header)
        );
      }
      multiValueArrHelper(MVT, i, multiValueArr);
    }
    for (i = 0; i < 5; i++) {
      multiValueArr[i] = multiValueArr[i].join("; ");
    }
    appendTitleToFront(multiValueArr, MVT);

    finalMap = mapPreviewArr;

    for (i = 0; i < finalMap.length; i++) {
      if (finalMap[i].includes(MVT[0])) {
        finalMap[i] = multiValueArr[0];
        if (fieldIndex === -1) {
          fieldIndex = i;
        }
      } else if (finalMap[i].includes(MVT[1])) {
        finalMap[i] = multiValueArr[1];
        if (descripIndex === -1) {
          descripIndex = i;
        }
      } else if (finalMap[i].includes(MVT[2])) {
        finalMap[i] = multiValueArr[2];
        if (sampleIndex === -1) {
          sampleIndex = i;
        }
      } else if (finalMap[i].includes(MVT[3])) {
        finalMap[i] = multiValueArr[3];
        if (geoIndex === -1) {
          geoIndex = i;
        }
      } else if (finalMap[i].includes(MVT[4])) {
        finalMap[i] = multiValueArr[4];
        if (sizeIndex === -1) {
          sizeIndex = i;
        }
      }
    }
    for (i = 0; i < finalMap.length; i++) {
      if (!arr.includes(finalMap[i])) {
        if (!(finalMap[i].includes(MVT[0]) && i !== fieldIndex))
          arr.push(finalMap[i]);
        else if (!(finalMap[i].includes(MVT[1]) && i !== descripIndex))
          arr.push(finalMap[i]);
        else if (!(finalMap[i].includes(MVT[2]) && i !== sampleIndex))
          arr.push(finalMap[i]);
        else if (!(finalMap[i].includes(MVT[3]) && i !== geoIndex))
          arr.push(finalMap[i]);
        else if (!(finalMap[i].includes(MVT[4]) && i !== sizeIndex))
          arr.push(finalMap[i]);
      }
    }

    finalArray = arr;

    return finalArray;
  };

  const hideOrShow = () => {
    let final = "";
    if (props.hide) {
      final = "Show Unused Fields";
    } else {
      final = "Hide Unused Fields";
    }
    return final;
  };

  return (
    /////////////////////////
    // TOOLBAR /////////////
    ///////////////////////
    // Field Cards ///////
    /////////////////////

    <div>
      <div className="label">
        <div className="container-fluid">
          <CardListMenu
            toggleIndex={toggleIndex}
            refreshButton={() => refreshButton()}
            upArrowToggle={() => upArrowToggle()}
            downArrowToggle={() => downArrowToggle()}
            hideOrShow={() => hideOrShow()}
            callbacks={() => props.callback(previewPopUp())}
            previewPop={() => previewPopUp()}
          />

          <HeaderFieldCard />
        </div>

        <div class="container-fluid">{fields}</div>
      </div>
      <div>
        Icons made by{" "}
        <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
          Freepik
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    hasInit: state.marsMapMaker.hasInit,
    hide: state.marsMapMaker.hide,
    ent: state.marsMapMaker.entries,
    persist: state.marsMapMaker.persistingMetaData,
    toggleArr: state.marsMapMaker.toggleArr,
    toggleIndex: state.marsMapMaker.toggleIndex,
    usingToggle: state.marsMapMaker.toggleInUse,
    hasDateFormat: state.marsMapMaker.hasChosenDateFormat,
    storeJsFile: state.marsMapMaker.jsFile,
    multiCount: state.marsMapMaker.totalMultiCount,
    fileMeta: state.marsMapMaker.fileMetadata
  };
};

export default connect(
  mapStateToProps,
  { firstState, toggleInUse }
)(CardList);
