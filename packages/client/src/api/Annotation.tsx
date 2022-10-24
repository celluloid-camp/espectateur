import axios from 'axios'; 
import PATH from './Parameters';

function addAnnotation(data:any) {
    const route=PATH+'annotation'
    console.log('in post data',data.objet)
    axios.post(route, {
        projectId :data.projectId,
        userId:data.userId,
        commentaire:data.commentaire,
        stopTime:data.stopTime,
        startTime:data.startTime,
        objet:data.objet,
        userName:data.userName,
        relation:data.relation,
        annotationId:data.annotationId
      })
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });

}
 export default addAnnotation;

 export async function getAnnotationConcept(idAnnotation:String){
    let concept: 'Spectacle' 
    const route= PATH+'ontology?idAnnotation='+idAnnotation;
    const response= await axios.get(route)
    concept=response.data.concept
    let relationConcept=response.data.relationConcept
    let res: Array<string>= []
    res.push(concept)
    res.push(relationConcept)
    return res

}

export async function getConcept(idAnnotation:String){
 
  const route= PATH+'ontology?idAnnotation='+idAnnotation;
  const response= await axios.get(route)
  let concept=response.data.concept
  let superClass= response.data.superConcept
  let relationConcept=response.data.relationConcept
  let res: Array<string>= []
  res.push(concept)
  res.push(superClass)
  res.push(relationConcept)
  return res   
}