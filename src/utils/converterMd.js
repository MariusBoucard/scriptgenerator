export function objectToMarkdown(obj) {
    let markdown = "";
    markdown+= getTitle(obj)
    markdown += getSynopsis(obj)
    markdown += getActors(obj)
    markdown += getCharacters(obj)
    markdown += getZones(obj)
    markdown += getPlans(obj)
    // markdown += getImages(obj)
    markdown += getImagesTab(obj)
    markdown += getOutils(obj)

    // for (const key in obj) {
    //   if (obj.hasOwnProperty(key)) {
    //     markdown += `## ${key}\n\n`;
    //     const value = obj[key];
    //     if (typeof value === "object") {
    //       markdown += objectToMarkdown(value);
    //     } else {
    //       markdown += `${value}\n\n`;
    //     }
    //   }
    // }
    return markdown;
  }

export function  getTitle(obj){
    return `## <center> ${obj.title} </center>\n\n<center>This Script has been written by : </center>`;
  }

  export function  getSynopsis(obj){
    return `## <center>Synopsis</center>\n\n${obj.synopsis}\n\n `;
  }

  export function getActors(obj){
    var mdList = ""
    obj.actorList.forEach(actor =>{

        mdList += `- ${actor.name}`;
        mdList += ` roles : ${actor.role}`;
        mdList += ` Infos : ${actor.moreInfo}\n`; 
    })
    return `## <center> Actors </center> \n\n ${mdList}\n\n `
  }
  export function getCharacters(obj){
    var mdList = ""
    obj.characterList.forEach(actor =>{

        mdList += `- ${actor.name}`;
        mdList += ` Costumes : ${actor.accessoire}`;
        mdList += ` Infos : ${actor.moreInfo}\n`; 
    })
    return `## <center> Characters </center> \n\n ${mdList} \n\n `
  }

  export function getZones(obj){
    var mdList = ""
    obj.usableZoneList.forEach(zone =>{

        mdList += `- ${zone.id}`;
        mdList += ` Name : ${zone.name}`;
        mdList += ` Couleur : <div style="background-color: ${zone.color}; width: 50px; height: 50px;"></div>\n`; 
    })
    return `## <center> Zones song </center> \n\n ${mdList} \n\n `
  }
  export function getPlans(obj){
    var mdList = ""
    var plan = obj.usablePlanList.sort((a,b) => a.id-b.id)
    plan.forEach(zone =>{

        mdList += `- ${zone.id}`;
        mdList += ` Name : ${zone.name}`;
        mdList += ` Description : ${zone.description} `;
        mdList += ` Couleur : <div style="background-color: ${zone.color}; width: 50px; height: 50px;"></div>\n`; 
    })
    return `## <center> Plans song </center> \n\n ${mdList} \n\n `
  }
  


  export function getOutils(obj){
    var mdList = ""
    obj.typeOutil.forEach(type =>
        {
            mdList += `- # ${type}\n`;
            obj.magasinOutils.filter(ob => ob.type === type).forEach(
                item =>
                mdList += `  - ${item.name} x ${item.quantity}\n`
            )    
        }
        )
    return `## <center> Outils Needed </center> \n\n${mdList} \n\n `

  }


  export function getImages(obj){
    var mdList = ""
    obj.timeline.planList.forEach(plan =>
        {
            mdList += `## <center> My Konva Image </center>\n\n![Konva Image](${plan.planData})`;
        }
        )
    return `## <center> Outils Needed </center> \n\n${mdList} \n\n `

  }

  export function getImagesTab(obj){
    var zone = obj.timeline.zoneList.sort((a,b)=> a.numero-b.numero)
    var mdList = ""


    zone.forEach((zo) => {
      mdList += `\n\n| zoneId | Numero dans Zone | Image | time | description | paroles | Personnages |\n|---:|---:|----------------------------|---|---------|------|-----| \n `;
      obj.timeline.planList
        .filter((plan) => plan.zone === zo.numero)
        .forEach((p) => {
          const names = p.characters ? p.characters.map((obj) => obj.name).join(", ") : " ";
          const planData = p.planData ? `![Konva Image](${p.planData})` : " ";
          const description = p.description ? p.description.replace(/\|/g, "\\|").replace(/\-/g, "\\-").replace(/\n/g, " ") : " ";
          const paroles = p.paroles ? p.paroles.replace(/\|/g, "\\|").replace(/\n/g, " ") : " ";
          mdList += `| ${zo.numero} | ${p.numeroDsZone} | ${planData} | ${formatSeconds(
            p.timeDeb
          )} / ${formatSeconds(p.timeFin)} | ${description} | ${paroles} | ${names.replace(
            /\|/g,
            "\\|"
          )} |\n`;
        });
    });
        
    return `## <center> Plan par plan </center> \n\n${mdList} \n\n `
          }
  export function formatSeconds(seconds) {
    const dateObj = new Date(seconds * 1000);
    const minutes = dateObj.getUTCMinutes();
    const secondsFormatted = dateObj.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(dateObj.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    return `${minutes}:${secondsFormatted}.${milliseconds}`;
  }