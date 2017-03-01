(function() {
  const config = {
 //firebase console
  };
  firebase.initializeApp(config);
    const preObject = document.getElementById('object');
    const ulList = document.getElementById('list');
    const divv = document.getElementById('divv');
    //update
    const edit = document.getElementById('edit');
    const formUpdate = document.getElementById('form-update');
    const insertUpdate = document.getElementById('updateForm');
    //insert
    const formData = document.getElementById('form-data');
    const insertInput = document.getElementById('Insert');

    const deleteData = document.getElementById('deleteData');

    formData.addEventListener('submit', saveMessage.bind(this));
    formUpdate.addEventListener('submit', UpdateMessage.bind(this));

    // Create reference
    const dbRefObject = firebase.database().ref().child('object');
    const dbRefList = dbRefObject.child('last'); //last
    const dbRef = firebase.database().ref().child('youtube');
    dbRef.off();

    // Sync object changes
    dbRefObject.on('value', function(snap) {
        preObject.innerText = JSON.stringify(snap.val(), null, 3);
    });

    function saveMessage(e) {
        e.preventDefault();
        if (insertInput.value) {
            dbRef.push({url: insertInput.value});
            formData.reset();
        }
    }
    //Sync List
    dbRefList.on('child_added', snap => {
        const li = document.createElement('li');
        li.innerText = snap.val();
        li.id = snap.key;
        ulList.appendChild(li);
    });

    dbRefList.on('child_changed', snap => {
        const listChanged = document.getElementById(snap.key);
        listChanged.innerText = snap.val();
    });

    dbRefList.on('child_removed', snap => {
        const liToRemove = document.getElementById(snap.key);
        liToRemove.remove();
    });

    //update
    dbRef.on('child_added', snap => {
        const a = document.createElement('a');
        const vala = snap.val();
        a.innerText  = vala.url;
        a.id = snap.key;


        // a.setAttribute('onclick'," onClickLink('11')");
        a.addEventListener("click", function(event) {
          myFunctionUp(snap.key,vala.url);
          event.preventDefault();
            insertUpdate.disabled = false;
        });
        edit.appendChild(a);
    });

    function myFunctionUp(idd,data) {
      const inHidden = document.createElement('input');
      inHidden.setAttribute('type', 'hidden');
      inHidden.value = idd;
      insertUpdate.value = data;
      inHidden.setAttribute('id', 'updateIn');
      formUpdate.appendChild(inHidden);
    }
    function UpdateMessage(e) {
        e.preventDefault();
        const getIdUpdate = document.getElementById('updateIn');
        if (insertUpdate.value) {
          const postData ={ url: insertUpdate.value }
          var updates = {};
          updates['/' + getIdUpdate.value] = postData;
          dbRef.update(updates);
          getIdUpdate.remove();
          formUpdate.reset();
              insertUpdate.disabled = true;
        }
    }
    //--------------------------------------------------------------------------//

    //youtube
    dbRef.on('child_added', snap => {
        const valD = snap.val();
        const div = document.createElement('div');
        div.setAttribute('class', snap.key+' column is-4');
        divv.appendChild(div);
        const ifrm = document.createElement("iframe");
        ifrm.setAttribute("class", snap.key);
        ifrm.setAttribute("src", "https://www.youtube.com/embed/" + valD.url);
        ifrm.setAttribute("type", 'text/html');
        ifrm.setAttribute("frameborder", '0');
        ifrm.setAttribute("allowfullscreen", '');
        ifrm.setAttribute("style", 'width:100% ');
        div.appendChild(ifrm);
    });

    dbRef.on('child_changed', snap => {
        const listChanged = document.getElementById(snap.key);
        const youChanged = document.getElementsByClassName(snap.key)[0];
        const valD = snap.val();
        listChanged.innerText = valD.url;
        youChanged.src = "https://www.youtube.com/embed/" + valD.url;
    });

    dbRef.on('child_removed', snap => {
        const liToRemove = document.getElementById(snap.key);
        liToRemove.remove();
        var myNode = document.getElementsByClassName(snap.key)[0];
        myNode.remove();
    });

    dbRef.on('child_added', snap =>{
      const delElement = document.createElement('a');
      const valdel = snap.val();
      delElement.innerHTML  = "<center><span class='icon is-medium'><i class='fa fa-trash' aria-hidden='true'></i></span></center>"+valdel.url;
      delElement.setAttribute("class", snap.key);
      delElement.addEventListener("click", function(event) {
        swal({
          title: "Are you Delete?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete",
          cancelButtonText: "cancel",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm){
          if (isConfirm) {
              myFunctionDel(snap.key);
          }
        });
        event.preventDefault();
      });
      deleteData.appendChild(delElement);
    });
  function myFunctionDel(id){
    const getIdDel = id;
     dbRef.child(getIdDel).remove();
    };



}());
