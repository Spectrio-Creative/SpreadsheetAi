function createAction(name) {
  const actionString = [
    "/version 3",
    "/name [ 13",
    "	53707265616473686565744169",
    "]",
    "/isOpen 1",
    "/actionCount 1",
    "/action-1 {",
    "	/name [ 15",
    "		4475706c6963617465204c61796572",
    "	]",
    "	/keyIndex 0",
    "	/colorIndex 0",
    "	/isOpen 0",
    "	/eventCount 2",
    "	/event-1 {",
    "		/useRulersIn1stQuadrant 0",
    "		/internalName (ai_plugin_Layer)",
    "		/localizedName [ 5",
    "			4c61796572",
    "		]",
    "		/isOpen 0",
    "		/isOn 1",
    "		/hasDialog 0",
    "		/parameterCount 2",
    "		/parameter-1 {",
    "			/key 1836411236",
    "			/showInPalette 4294967295",
    "			/type (integer)",
    "			/value 1",
    "		}",
    "		/parameter-2 {",
    "			/key 1851878757",
    "			/showInPalette 4294967295",
    "			/type (ustring)",
    "			/value [ 19",
    "				4475706c69636174652053656c656374696f6e",
    "			]",
    "		}",
    "	}",
    "	/event-2 {",
    "		/useRulersIn1stQuadrant 0",
    "		/internalName (adobe_selectAll)",
    "		/localizedName [ 10",
    "			53656c65637420416c6c",
    "		]",
    "		/isOpen 0",
    "		/isOn 1",
    "		/hasDialog 0",
    "		/parameterCount 0",
    "	}",
    "}",
    "",
  ];

  function createNewAction(actionStr, set) {
    var f = new File(set + ".aia");
    f.open("w");
    f.write(actionStr);
    f.close();
    app.loadAction(f); //LINE 75
    f.remove();
  }

  createNewAction(actionString, name);
}

export { createAction };
