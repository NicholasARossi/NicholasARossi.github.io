
var v_doc = app.activeDocument;
var v_selection = v_doc.selection;



swapFillStroke(v_selection);



function swapFillStroke(objSel) {
    var ob_keep = null;
    for(k = 0; k < objSel.length; k++){
           var subSel = objSel[k];
            if(subSel.typename == 'PathItem'){
                  var c_fill = subSel.fillColor;
                  var c_stroke = subSel.strokeColor;
                  subSel.fillColor = c_stroke;
                  if(!subSel.stroked)
                       subSel.stroked = true;
                  subSel.strokeColor = c_fill;
            } else {
                  if(ob_keep==null) {
                       ob_keep = new Array();
                       ob_keep.push(objSel[k]);
                  } else {
                      ob_keep.length +=1;
                      ob_keep.push(objSel[k]);
                 }
           }
    }
    if(ob_keep !=null){
        for(n = 0; n < ob_keep.length; n++) {
            if(ob_keep[n].typename == 'GroupItem') swapFillStroke(ob_keep[n].pageItems);
            else if (ob_keep[n].typename == 'CompoundPathItem') swapFillStroke(ob_keep[n].pathItems);
        }
      }
}



redraw();