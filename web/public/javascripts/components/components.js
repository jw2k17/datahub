function setOwnerNameAutocomplete(controller)
{
  if (!controller)
  {
    return;
  }

  $('.userEntity').blur(function(data){
    var userEntitiesMaps = controller.get("userEntitiesMaps");
    var value = this.value;
    if (userEntitiesMaps[value])
    {
      controller.set("showMsg", false);
      var owners = controller.get("owners");
      for(var i = 0; i < owners.length; i++)
      {
        if (owners[i].userName == value)
        {
          Ember.set(owners[i], "name", userEntitiesMaps[value]);
          if (userEntitiesMaps[value])
          {
            Ember.set(owners[i], "isGroup", false);
          }
          else
          {
            Ember.set(owners[i], "isGroup", true);
          }
        }
      }
    }
    else
    {
      controller.set("showMsg", true);
      controller.set("alertType", "alert-danger");
      controller.set("ownerMessage", "The user name '" + value + "' is invalid");
    }
  });

  $('.userEntity').autocomplete({
    select: function( event, ui )
    {
      var userEntitiesMaps = controller.get("userEntitiesMaps");
      var value = ui.item.value;
      if (value in userEntitiesMaps)
      {
        var owners = controller.get("owners");
        for(var i = 0; i < owners.length; i++)
        {
          if (owners[i].userName == value)
          {
            controller.set("showMsg", false);
            Ember.set(owners[i], "name", userEntitiesMaps[value]);
            if (userEntitiesMaps[value])
            {
              Ember.set(owners[i], "isGroup", false);
            }
            else
            {
              Ember.set(owners[i], "isGroup", true);
            }
          }
        }
      }
    },

    source: function(request, response) {
      var userEntitiesSource = controller.get("userEntitiesSource");
      var results = $.ui.autocomplete.filter(userEntitiesSource, request.term);
      response(results.slice(0, 20));
    }

  });
}

App.EmberSelectorComponent = Ember.Component.extend({
  class: 'form-control',
  content: [],

  init() {
    this._super(...arguments);
    this.updateContent();
  },

  onSelectionChanged: Ember.observer('selected', function () {
    this.updateContent();
  }),

  /**
   * Parse and transform the values list into a list of objects with the currently
   * selected option flagged as `isSelected`
   */
  updateContent() {
    let selected = this.get('selected') || '';
    selected && (selected = String(selected).toLowerCase());

    const options = this.get('values') || [];
    const content = options.map(option => {
      if (typeof option === 'object' && typeof option.value !== 'undefined') {
        const isSelected = String(option.value).toLowerCase() === selected;
        return {value: option.value, label: option.label, isSelected};
      }

      return {value: option, isSelected: String(option).toLowerCase() === selected};
    });

    this.set('content', content);
  },

  actions: {
    // Reflect UI changes in the component and bubble the `selectionDidChange` action
    change() {
      const {selectedIndex} = this.$('select')[0];
      const values = this.get('values');
      const _selected = values[selectedIndex];
      const selected = typeof _selected.value !== 'undefined' ? _selected.value : _selected;

      this.set('selected', selected);

      this.sendAction('selectionDidChange', _selected);
    }
  }
});

// Component  wrapper for a droppable DOM region
App.DropRegionComponent = Ember.Component.extend({
  classNames: ['drop-region'],
  classNameBindings: ['dragClass'],
  dragClass: 'deactivated',

  dragLeave(e) {
    e.preventDefault();
    this.set('dragClass', 'deactivated');
  },

  dragOver(e) {
    e.preventDefault();
    this.set('dragClass', 'activated');
  },

  drop (e) {
    const data = e.dataTransfer.getData('text/data');
    this.sendAction('dropped', data, this.get('param'));
    this.set('dragClass', 'deactivated');
  }
});

// Component wrapper for a draggable item
App.DraggableItemComponent = Ember.Component.extend({
  tagName: 'span',
  classNames: ['draggable-item'],
  attributeBindings: ['draggable'],
  draggable: 'true',

  dragStart(e) {
    return e.dataTransfer.setData('text/data', this.get('content'));
  }
});

App.DatasetPropertyComponent = Ember.Component.extend({
});

App.DatasetSchemaComponent = Ember.Component.extend({
  buildJsonView: function(){
    var dataset = this.get("dataset");
    var schema = JSON.parse(dataset.schema)
    setTimeout(function() {
      $("#json-viewer").JSONView(schema)
    }, 500);
  },
  actions: {
    getSchema: function(){
      var _this = this
      var id = _this.get('dataset.id')
      var columnUrl = 'api/v1/datasets/' + id + "/columns";
      _this.set("isTable", true);
      _this.set("isJSON", false);
      $.get(columnUrl, function(data) {
        if (data && data.status == "ok")
        {
          if (data.columns && (data.columns.length > 0))
          {
            _this.set("hasSchemas", true);
            data.columns = data.columns.map(function(item, idx){
              item.commentHtml = marked(item.comment).htmlSafe()
              return item
            })
            _this.set("schemas", data.columns);
            setTimeout(initializeColumnTreeGrid, 500);
          }
          else
          {
            _this.set("hasSchemas", false);
          }
        }
        else
        {
          _this.set("hasSchemas", false);
        }
      });
    },
    setView: function (view) {
      switch (view) {
        case "tabular":
          this.set('isTable', true);
          this.set('isJSON', false);
          $('#json-viewer').hide();
          $('#json-table').show();
          break;
        case "json":
          this.set('isTable', false);
          this.set('isJSON', true);
          this.buildJsonView();
          $('#json-table').hide();
          $('#json-viewer').show();
          break;
        default:
          this.set('isTable', true);
          this.set('isJSON', false);
          $('#json-viewer').hide();
          $('#json-table').show();
      }
    }
  }
});

App.DatasetSampleComponent = Ember.Component.extend({
});

App.DatasetAccessComponent = Ember.Component.extend({
});

App.DatasetImpactComponent = Ember.Component.extend({
});

App.DatasetComplianceComponent = Ember.Component.extend({
  matchingFields: [],
  fieldList: [],
  typeList: [],
  complianceType: Ember.computed.alias('securitySpec.complianceType'),

  /**
   * Aliases compliancePurgeEntities on securitySpec, and transforms each nested comma-delimited identifierField string
   * into an array of fields that can easily be iterated over. Dependency on each identifierField will update
   * UI on updates
   */
  purgeEntities: Ember.computed('securitySpec.compliancePurgeEntities.@each.identifierField', function () {
    return this.get('securitySpec.compliancePurgeEntities').map(entity => {
      let _entity = Object.assign({}, entity);
      _entity.identifierField = _entity.identifierField.split(',');
      return _entity;
    });
  }),

  init() {
    this._super(...arguments);
    this.fetchData();
  },

  didRender() {
    const $typeahead = this.$('#compliance-typeahead');
    if ($typeahead.length) {
      this.enableTypeaheadOn($typeahead);
    }
  },

  fetchData() {
    function processSchema(schemaData) {
      var concatName,
          schemaArr = [],
          typeArr = [],
          schemaObj = {};


      function processSchemaChildren(rootName, fieldObj) {
        var concatName,
            subRootName;

        concatName = rootName + '.' + fieldObj.name;
        if (typeof fieldObj.type !== 'object') {
          schemaArr.push(concatName);
          typeArr[concatName] = fieldObj.type;
        } else {
          if (typeof fieldObj.type[1] === 'string') {
            schemaArr.push(concatName);
            typeArr[concatName] = fieldObj.type[1];
          } else if (fieldObj.type.name) {
            concatName = concatName + '.' + fieldObj.type.name;
            schemaArr.push(concatName);
            typeArr[concatName] = fieldObj.type.type;
          } else if (typeof fieldObj.type[1].type === 'string' && !fieldObj.type[1].fields) {
            concatName = concatName + '.' + fieldObj.type[1].name;
            schemaArr.push(concatName);
            typeArr[concatName] = fieldObj.type[1].type;
          } else {
            subRootName = concatName + '.' + fieldObj.type[1].name;
            fieldObj.type[1].fields.forEach(function (subFieldObj) {
              processSchemaChildren(subRootName, subFieldObj);
            });
          }
        }
      }

      // Create typeahead-friendly array of fields
      schemaData.fields.forEach(function (field) {
        if (field.type.fields) {
          concatNameRoot = field.name + '.' + field.type.name;
          field.type.fields.forEach(function (fieldObj) {
            processSchemaChildren(concatNameRoot, fieldObj);
          });
        } else {
          concatName = field.name;
          schemaArr.push(concatName);
          typeArr[concatName] = typeof field.type === 'string' ? field.type : field.type[this.length];
        }
      });

      schemaObj.fieldList = schemaArr;
      schemaObj.typeArr = typeArr;

      return {fieldList: schemaArr, typeList: typeArr};
    }

    return Promise.resolve(Ember.$.getJSON(`api/v1/datasets/${this.get('datasetId')}`))
        .then(({dataset: {schema}}) => {
          const {fieldList, typeList} = processSchema(JSON.parse(schema));
          this.get('fieldList').setObjects(fieldList);
          this.get('typeList').setObjects(typeList);
        });
  },

  saveJson(data) {
    const postRequest = {
      type: 'POST',
      url: `api/v1/datasets/${this.get('datasetId')}/security`,
      data: JSON.stringify(data),
      contentType: 'application/json'
    };

    // If the return_code is not 200 reject the Promise
    return Promise.resolve(Ember.$.ajax(postRequest))
        .then(({return_code}) => return_code === 200 ? arguments[0] : Promise.reject(return_code));
  },

  enableTypeaheadOn(selector) {
    selector.autocomplete({
      source: request => {
        const {term = ''} = request;
        const matchingFields = $.ui.autocomplete.filter(this.get('fieldList'), term);
        // Using setObject to reuse the previous matchingFields array
        this.get('matchingFields').setObjects(matchingFields);
        // response(matchingFields);
      }
    });
  },

  /**
   * Returns a compliancePurgeEntity matching the given Id.
   * @param {string} id value representing the identifierType
   * @returns {*}
   */
  getPurgeEntity (id) {
    // There should be only one match in the resulting array
    return this.get('securitySpec.compliancePurgeEntities')
        .filter(purgeEntity => purgeEntity.identifierType === id)
        .get('firstObject');
  },

  /**
   * Internal abstraction for adding and removing an Id from an identifierField
   * @param {string} name name of identifier to add/remove from identifier type
   * @param {string} idType the identifierType for a compliancePurgeEntity
   * @param {string} toggleOperation string representing the operation to be performed
   * @private
   */
  _togglePurgeIdOnIdentifierField (name, idType, toggleOperation) {
    const operations = ['add', 'remove'];
    const purgeEntity = this.getPurgeEntity(idType);
    const currentId = purgeEntity.identifierField;
    if (!operations.includes(toggleOperation)) {
      return;
    }
    const updatedIds = currentId.split(',')[`${toggleOperation}Object`](name).join(',');

    Ember.set(purgeEntity, 'identifierField', updatedIds);
  },

  actions: {
    addPurgeId(name, idType) {
      this._togglePurgeIdOnIdentifierField(name, idType, `add`);
    },

    removePurgeId(name, idType) {
      this._togglePurgeIdOnIdentifierField(name, idType, `remove`);
    },

    updateComplianceType ({value}) {
      this.set('securitySpec.complianceType', value);
    },

    saveCompliance () {
      this.saveJson(this.get('securitySpec'));

      return false;
    },

    // Rolls back changes made to the compliance spec to current
    // server state
    resetCompliance () {
      this.get('onReset')();
    }
  }
});

App.DatasetAuthorComponent = Ember.Component.extend({
  actions: {
    addOwner: function(data) {
      var owners = data;
      var controller = this.get("parentController");
      var currentUser = this.get("currentUser");
      var addedOwner = {"userName":"Owner","email":null,"name":"","isGroup":false,
        "namespace":"urn:li:griduser","type":"Producer","subType":null,"sortId":0};
      var userEntitiesSource = controller.get("userEntitiesSource");
      var userEntitiesMaps = controller.get("userEntitiesMaps");
      var exist = false;
      if (owners && owners.length > 0)
      {
        owners.forEach(function(owner){
          if(owner.userName == addedOwner.userName)
          {
            exist = true;
          }
        });
      }
      if (!exist)
      {
        owners.unshiftObject(addedOwner);
        setTimeout(function(){
          setOwnerNameAutocomplete(controller)
        }, 500);
      }
      else
      {
        console.log("The owner is already exist");
      }
    },
    removeOwner: function(owners, owner) {
      if (owners && owner)
      {
        owners.removeObject(owner);
      }
    },
    confirmOwner: function(owner, confirm) {
      var obj = $('#loggedInUser');
      if (obj)
      {
        var loggedInUser = obj.attr("title");
        if (loggedInUser && owner)
        {
          if (confirm)
          {
            Ember.set(owner, "confirmedBy", loggedInUser);
          }
          else
          {
            Ember.set(owner, "confirmedBy", null);
          }
        }
      }
    },
    updateOwners: function(owners) {
      _this = this;
      controller = this.get("parentController");
      var showMsg = controller.get("showMsg");
      if (showMsg)
      {
        return;
      }
      var model = controller.get("model");
      if (!model || !model.id)
      {
        return;
      }
      var url = "/api/v1/datasets/" + model.id + "/owners";
      var token = $("#csrfToken").val().replace('/', '');
      $.ajax({
        url: url,
        method: 'POST',
        header: {
          'Csrf-Token': token
        },
        data: {
          csrfToken: token,
          owners: JSON.stringify(owners)
        }
      }).done(function(data, txt, xhr){
        if (data.status == "success")
        {
          _this.set('showMsg', true);
          _this.set('alertType', "alert-success");
          _this.set('ownerMessage', "Ownership successfully updated.");
        }
        else
        {
          _this.set('showMsg', true);
          _this.set('alertType', "alert-danger");
          _this.set('ownerMessage', "Ownership update failed.");
        }

      }).fail(function(xhr, txt, error){
        _this.set('showMsg', true);
        _this.set('alertType', "alert-danger");
        _this.set('ownerMessage', "Ownership update failed.");
      })
    }
  }
});

App.DatasetRelationsComponent = Ember.Component.extend({
});

App.MetricDetailComponent = Ember.Component.extend({
});

App.DatasetFavoriteComponent = Ember.Component.extend({
  actions: {
    favorites: function(dataset) {
      var url = '/api/v1/datasets/' + dataset.id + '/favorite'
      var method = !dataset.isFavorite ? 'POST' : 'DELETE'
      var token = $("#csrfToken").val().replace('/', '')
      var _this = this
      $.ajax({
        url: url,
        method: method,
        headers: {
          'Csrf-Token': token
        },
        dataType: 'json',
        data: {
          csrfToken: token
        }
      }).done(function(data, txt, xhr){
        _this.set('dataset.isFavorite', !dataset.isFavorite)
      }).fail(function(xhr, txt, err){
        console.log('Error: Could not update dataset favorite.')
      })
    }
  }
})

App.DatasetOwnerComponent = Ember.Component.extend({
  actions: {
    owned: function(dataset) {
      var url = '/api/v1/datasets/' + dataset.id + '/own';
      var method = !dataset.isOwned ? 'POST' : 'DELETE';
      var token = $("#csrfToken").val().replace('/', '');
      var _this = this;
      $.ajax({
        url: url,
        method: method,
        headers: {
          'Csrf-Token': token
        },
        dataType: 'json',
        data: {
          csrfToken: token
        }
      }).done(function(data, txt, xhr){
        if (data.status == 'success')
        {
          _this.set('dataset.isOwned', !dataset.isOwned);
          _this.set('dataset.owners', data.owners);
        }
      }).fail(function(xhr, txt, err){
        console.log('Error: Could not update dataset owner.')
      })
    }
  }
})

var insertAtCursor = function( myField, myValue, newline ) {
  if( myField[0].selectionStart || myField[0].selectionStart == '0' ) {
    var startPos = myField[0].selectionStart;
    var endPos = myField[0].selectionEnd;
    var value;
    if (newline)
    {
      value = myField.val().substring(0, startPos) + '\n' +
          myValue + myField.val().substring(endPos, myField.val().length);
    }
    else
    {
      value = myField.val().substring(0, startPos) +
          myValue + myField.val().substring(endPos, myField.val().length);
    }

    myField.val(value);
    myField[0].selectionEnd = myField.selectionStart = startPos + myValue.length;
  } else {
    var value;
    if (newline)
    {
      value = myField.val() + '\n' + myValue;
    }
    else
    {
      value = myField.val() + myValue;
    }

    myField.val(value);
  }
};

var insertListAtCursor = function( myField, myValue, number ) {
  if( myField[0].selectionStart || myField[0].selectionStart == '0' ) {
    var startPos = myField[0].selectionStart;
    var endPos = myField[0].selectionEnd;
    var selection;
    var value;
    if (endPos > startPos)
    {
      selection = myField.val().substring(startPos, endPos);
    }
    var insertvalue = "";
    if (selection)
    {
      var lines = selection.split('\n');
      for(var i = 0; i < lines.length; i++)
      {
        if (number == 'numbered')
        {
          insertvalue += (i+1) + ".";
        }
        else if(number == 'bulleted')
        {
          insertvalue += "-";
        }
        else if(number == 'blockquote')
        {
          insertvalue += "> ";
        }
        insertvalue += " " + lines[i];
        if (i < lines.length)
        {
          insertvalue += "\n";
        }
      }
      value = myField.val().substring(0, startPos) + insertvalue + myField.val().substring(endPos, myField.val().length);
      myField.val(value);
      myField[0].selectionEnd = myField.selectionStart = startPos + insertvalue.length;
      return;
    }
  }

  var lines = myValue.split('\n');
  for(var i = 0; i < lines.length; i++)
  {
    if (number == 'numbered')
    {
      insertvalue += (i+1) + ".";
    }
    else if(number == 'bulleted')
    {
      insertvalue += "-";
    }
    else if(number == 'blockquote')
    {
      insertvalue += ">";
    }
    insertvalue += " " + lines[i];
    if (i < lines.length)
    {
      insertvalue += "\n";
    }
  }
  value = myField.val() + '\n' + insertvalue;
  myField.val(value);
};

var insertSourcecodeAtCursor = function( myField ) {
  if( myField[0].selectionStart || myField[0].selectionStart == '0' ) {
    var startPos = myField[0].selectionStart;
    var endPos = myField[0].selectionEnd;
    var selection;
    var value;
    if (endPos > startPos)
    {
      selection = myField.val().substring(startPos, endPos);
    }
    var insertvalue = "```\n";
    if (selection) {
      insertvalue += selection + '\n```';
    }
    else {
      insertvalue += 'code text' + '\n```\n';
    }
    value = myField.val().substring(0, startPos) + insertvalue + myField.val().substring(endPos, myField.val().length);
    myField.val(value);
    myField[0].selectionEnd = myField.selectionStart = startPos + insertvalue.length;
    return;
  }
  var insertvalue = "```\n";
  insertvalue += 'code text' + '\n```\n';
  value = myField.val() + '\n' + insertvalue;
  myField.val(value);
};

var insertImageAtCursor = function( myField, param ) {
  if( myField[0].selectionStart || myField[0].selectionStart == '0' ) {
    var startPos = myField[0].selectionStart;
    var endPos = myField[0].selectionEnd;
    var selection;
    var value;
    if (endPos > startPos)
    {
      selection = myField.val().substring(startPos, endPos);
    }
    var insertvalue = "";
    if (selection && selection.length > 0 &&
        (selection.substr(0,7) == 'http://' || selection.substr(0,7) == 'https:/')) {
      if (param == 'image')
      {
        insertvalue = "[alt text]("+ selection +")";
      }
      else
      {
        insertvalue =  "["+ selection +"]("+ selection + ")";
      }

    }
    else {
      if (param == 'image')
      {
        insertvalue = "![alt text](http://path/to/img.jpg)";
      }
      else
      {
        insertvalue = "[example link](http://example.com/)";
      }

    }
    value = myField.val().substring(0, startPos) + insertvalue + myField.val().substring(endPos, myField.val().length);
    myField.val(value);
    myField[0].selectionEnd = myField.selectionStart = startPos + insertvalue.length;
    return;
  }
  if (param == 'image')
  {
    insertvalue = "![alt text](http://path/to/img.jpg)";
  }
  else
  {
    insertvalue = "[example link](http://example.com/)";
  }
  value = myField.val() + '\n' + insertvalue;
  myField.val(value);
};

var datasetCommentsComponent = null;
App.DatasetCommentsComponent = Ember.Component.extend({
  totalPages: null,
  commentsLoading: true,
  itemsPerPage: 3,
  page: 1,
  count: null,
  comments: [],
  comment: {},
  isEdit: false,
  commentTypes: [
    'Comment',
    'Question',
    'Description',
    'Partition',
    'ETL Schedule',
    'Grain',
    'DQ Issue'
  ],
  getComments: function(params){
    if (this.isDestroyed || this.isDestroying)
    {
      return;
    }
    var _this = this;
    datasetCommentsComponent = this;
    var datasetId = this.get('dataset.model.id')
    var url = '/api/v1/datasets/' + datasetId + '/comments'
    params =
    { size: (params || {}).size || this.get('itemsPerPage')
    , page: (params || {}).page || this.get('page')
    }
    url += '?' + $.param(params)
    $.get
    ( url
    , function(data) {
        if (_this.isDestroyed || _this.isDestroying)
        {
          return;
        }
        _this.set('totalPages', data.data.totalPages)
        _this.set('page', data.data.page)
        _this.set('count', data.data.count)
        _this.set('itemsPerPage', data.data.itemsPerPage)
        _this.set('commentsLoading', false)
        var comments = data.data.comments
        comments.forEach(function(cmnt){
          cmnt.html = marked(cmnt.text).htmlSafe();
        })
        _this.set('comments', comments);
      }
    )
    .fail(function(){
      _this.set('comments', [])
      _this.set('commentsLoading', false)
    })
  }.on('init'),
  defaultCommentText: function(){
    return "#We Support Markdown ([GitHub Flavored][gh])! \n##Secondary Header \n* bullet \n* bullet\n\n\n| Col 1 | Col 2 | Col 3|\n|:--|:--:|--:|\n|Left|Center|Right|\n```sql\nSELECT * FROM ABOOK_DATA WHERE modified_date > 1436830358700;\n```\n[ABOOK_DATA](/#/dataset/1/ABOOK_DATA) All links will open in a new tab\n\n[gh]: https://help.github.com/articles/github-flavored-markdown/"

  },
  setDefaultCommentText: function(){
    this.set('comment', {type: 'Comment'});
    this.set('comment.text', this.defaultCommentText());
  },
  actions: {
    insertImageOrLink: function(param) {
      var target = $('#datasetcomment');
      insertImageAtCursor(target, param);
      var text = $("#datasetComment-write > textarea").val()
      $("#datasetComment-preview").html(marked(text))
    },
    insertSourcecode: function() {
      var target = $('#datasetcomment');
      insertSourcecodeAtCursor(target);
      var text = $("#datasetComment-write > textarea").val()
      $("#datasetComment-preview").html(marked(text))
    },
    insertList: function(param) {
      var target = $('#datasetcomment');
      var value = "Apple\nBananna\nOrange";
      insertListAtCursor(target, value, param);
      var text = $("#datasetComment-write > textarea").val()
      $("#datasetComment-preview").html(marked(text))
    },
    insertElement: function(param) {
      var target = $('#datasetcomment');
      var value;
      var selectedValue;
      if( target[0].selectionStart || target[0].selectionStart == '0' ) {
        var startPos = target[0].selectionStart;
        var endPos = target[0].selectionEnd;
        selectedValue = target.val().substring(startPos, endPos);
      }
      var insertedValue;
      if (selectedValue)
      {
        insertedValue = selectedValue;
      }
      else
      {
        insertedValue = param + " text";
      }
      switch(param)
      {
        case 'bold':
          value = "**" + insertedValue + "**";
          break;
        case 'italic':
          value = "*" + insertedValue + "*";
          break;
        case 'heading_1':
          value = "#" + insertedValue + "#";
          break;
        case 'heading_2':
          value = "##" + insertedValue + "##";
          break;
        case 'heading_3':
          value = "###" + insertedValue + "###";
          break;
      }
      insertAtCursor(target, value, false);
      var text = $("#datasetComment-write > textarea").val()
      $("#datasetComment-preview").html(marked(text))
    },
    importCSVTable: function(){
      var input = $('#tsv-input');
      var output = $('#table-output');
      var headerCheckbox = $('#has-headers');
      var delimiterMarker = $('#delimiter-marker');
      var getDelimiter = function() {
        var delim = delimiterMarker.val();
        if( delim == 'tab' ) {
          delim = "\t";
        }
        return delim;
      };

      input.keydown(function( e ) {
        if( e.key == 'tab' ) {
          e.stop();
          insertAtCursor(e.target, "\t");
        }
      });

      var renderTable = function() {
        var value = input.val().trim();
        var hasHeader = headerCheckbox.is(":checked");
        var t = csvToMarkdown(value, getDelimiter(), hasHeader);
        output.val(csvToMarkdown(value, getDelimiter(), hasHeader));
      };

      input.keyup(renderTable);
      headerCheckbox.change(renderTable);
      delimiterMarker.change(renderTable);
      $('#submitConvertForm').click(function(){
        $("#convertTableModal").modal('hide');
        var target = $('#datasetcomment');
        insertAtCursor(target, output.val(), true);
        var text = $("#datasetComment-write > textarea").val();
        $("#datasetComment-preview").html(marked(text));
      });
      renderTable();
      $("#convertTableModal").modal('show');
    },
    remove: function(comment) {
      var url = '/api/v1/datasets/' + comment.datasetId + '/comments/' + comment.id
      var token = $("#csrfToken").val().replace('/', '')
      var _this = this
      $.ajax({
        url: url,
        method: 'DELETE',
        headers: {
          'Csrf-Token': token
        },
        dataType: 'json',
        data: {
          csrfToken: token
        }
      }).done(function(data, txt, xhr){
        _this.getComments()
      }).fail(function(xhr, txt, err){
        console.log('Error: Could not remove comment.')
      })
    },
    updatePreview: function(){
      var text = $("#datasetComment-write > textarea").val()
      $("#datasetComment-preview").html(marked(text))
    },
    update: function() {
      var token = $("#csrfToken").val().replace('/', '')
      var _this = this;
      comment.datasetId = this.get('dataset.id')
      var cmnt = {}
      cmnt.text = comment.text
      cmnt.type = comment.type
      var url = '/api/v1/datasets/' + comment.datasetId + '/comments/' + comment.id
      cmnt.csrfToken = token
      $.ajax({
        url: url,
        method: 'PUT',
        headers: {
          'Csrf-Token': token
        },
        dataType: 'json',
        data: {
          csrfToken: token
        }
      }).done(function(data, txt, xhr){
        _this.getComments()
      }).fail(function(xhr, txt, err){
        console.log('Error: Could not update comment.')
      })

    },
    create: function(comment) {
      var token = $("#csrfToken").val().replace('/', '')
      var _this = this;
      var cmnt = {}
      var isEdit = this.get('isEdit')
      cmnt.datasetId = this.get('dataset.model.id')
      cmnt.text = comment.text
      cmnt.type = comment.type
      cmnt.id = comment.id
      var url = '/api/v1/datasets/' + cmnt.datasetId + '/comments'
      cmnt.csrfToken = token
      console.log('comment data: ', cmnt)
      $.ajax({
        url: url,
        method: 'POST',
        headers: {
          'Csrf-Token': token
        },
        dataType: 'json',
        data: cmnt
      }).done(function(data, txt, xhr){
        _this.getComments()
        _this.send('hideModal')
      }).fail(function(xhr, txt, err){
        console.log('Error: Could not create comment.')
      })
    },
    showModal: function(comment) {
      if(comment) {
        this.set('comment', comment)
        this.set('isEdit', true)
        this.set('isEdit', false)
      } else {
        //this.set('comment', {type: 'Comment'})
        this.setDefaultCommentText();
        $("#datasetComment-preview").html(marked(this.defaultCommentText()));
      }
      $("#datasetCommentModal").modal('show')
    },
    hideModal: function(){
      this.set('isEdit', false)
      this.set('comment', {})
      $("#datasetCommentModal").modal('hide')
    },
    pageForward: function() {
      var totalPages = this.get('totalPages');
      var currentPage = this.get('page');
      if (currentPage < totalPages)
      {
        this.getComments({page: this.get('page') + 1});
      }

    },
    pageBack: function() {
      var currentPage = this.get('page');
      if (currentPage > 1)
      {
        this.getComments({page: this.get('page') - 1});
      }
    }
  }
})

App.DatasetWatchComponent = Ember.Component.extend({
  actions: {
    watch: function(dataset) {
      var url = '/api/v1/datasets/' + dataset.id + '/watch'
      var method = !dataset.watchId ? 'POST' : 'DELETE'
      if(method.toLowerCase() === 'delete')
        url += '/' + dataset.watchId
      var token = $("#csrfToken").val().replace('/', '')
      var _this = this
      $.ajax({
        url: url,
        method: method,
        headers: {
          'Csrf-Token': token
        },
        dataType: 'json',
        data: {
          csrfToken: token,
          item_type: 'dataset',
          notification_type: 'weekly'
        }
      }).done(function(data, txt, xhr){
        _this.set('dataset.isWatched', !dataset.isWatched)
        _this.sendAction('getDatasets')
      }).fail(function(xhr, txt, err){
        console.log('Error: Could not watch dataset.')
      })
    }
  }
});