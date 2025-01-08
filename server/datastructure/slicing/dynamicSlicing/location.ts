import { distanceBetweenTwoPoint, Circle, calculateCommonArea } from '../..'
import { Unit } from './unit';



export class Location {

    id: number;
    name: string;

    child: Array<Location> = [];// child should be anthor location
    parent: Location | number;


    unit: Array<Unit> = [];

    constructor(parent: Location | number, name: string) {
        this.id = 1234;
        this.parent = parent;
        this.name = name;
    }


    getOrCreatChild(name: string) {
        for (let x of this.child) {
            if (x.name == name) return x;
        }
        let childLocation = new Location(this, name);
        this.child.push(childLocation);
        return childLocation;
    }

    getOrCreateUnit(eventCircle: Circle) {
        let minDistance = 5 / 111;
        let sharedArea: Array<Unit> = [];
        let index = [];
        let cnt = 0;
        for (let x of this.unit) {
            let commonArea = calculateCommonArea({ x: x.latitude, y: x.longitude, radius: x.radius }, eventCircle);
            if (commonArea == 100) {
                return x;
            } else if (commonArea) {
                ///delete  x ;  unit.splice(indexToDelete, 1);
                //create new unit  
                sharedArea.push(x);
                index.push(cnt);
                cnt++;
            }
            else {
                let dist = distanceBetweenTwoPoint(eventCircle, { x: x.longitude, y: x.latitude, radius: x.radius }) - x.radius;
                minDistance = Math.min(dist, minDistance);
            }
        }

        while (sharedArea.length) {
            // @ts-ignore
            let xx: Unit = sharedArea.pop();
            let pos = index.pop();
            //queue.add(xx.id);
            if (pos) this.unit.splice(pos, 1);
        }

        let unit: Unit = new Unit(this, eventCircle.x, eventCircle.y, eventCircle.radius);
        this.unit.push(unit);
        return unit;
    }


    getCityNode(country: string, state: string, city: string) {
        let countryNode = this.getOrCreatChild(country);
        let stateNode = countryNode.getOrCreatChild(state);
        let cityNode = stateNode.getOrCreatChild(city);
        return cityNode;
    }






}


export const ROOT = new Location(-1, "ROOT");
