import axios from 'axios'; 
import PATH from './Parameters';

function getFirstConcepts ( endPoint: String ) {
    const route= PATH+endPoint;
    let options= [
        {
          concept: 'Show Description',
        },
      ];
      axios
      .get(route)
      .then(response => {
          const length= response.data.concept.length;
          console.log(length);
          let i=0;
          while (i !== length) {
            options.push({'concept':response.data.concept[i]});
            i++;
          }
      })
      .catch(function(error: Error) {
          console.log('Connection to Neo4j DataBase Failed');
          
      });
      return options;
}
export default getFirstConcepts;
export function getSubConcepts ( endPoint: String ) {
  const route= PATH+'conceptSubClass?concept='+endPoint;
  let options= [
      {
        concept: endPoint,
      },
    ];
    axios
    .get(route)
    .then(response => {
        const length= response.data.concept.length;
        console.log(length);
        let i=0;
        while (i !== length) {
          options.push({'concept':response.data.concept[i]});
          i++;
        }
    })
    .catch(function(error: Error) {
      console.log('Connexion to Graph DataBase Failed');
        
    });
    return options;
}
export function getRelation ( concept: String ) {
  if(concept==='Emotion'){
    return 'hasEmotion'
  }else{
    if(concept==='Staging'){
      return 'hasStaging'
    }else{
      if(concept==='Acting'){
        return 'hasActing'
      }else{
        if(concept==='Judgement'){
          return 'hasJudgement'
        }else{
          return 'hasDramaturgy'
        }
      }
     
    }
  }
}