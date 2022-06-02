import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { dataTabla } from 'src/app/interface/data.interface';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  tabla!: MatTableDataSource<any>;
  tabla2!: MatTableDataSource<any>;
  tabla3!: MatTableDataSource<any>;

  dataProceso: dataTabla | undefined 
  dataProcesoAux: dataTabla | undefined

  arrProcesos = <any>[]
  arrAcumulado = <any>[];
  calcular_bool = false;
  data = {
    id: 0,
    proceso: '',
    t_llegada: 0,
    rafaga: 9
  }
  val = true;
  arrtabla_TEP = <any> [];
  arrtabla_TRP = <any> [];
  arrDataAux = [
    {id: 0, proceso: 'P1', t_llegada: 0, rafaga: 9},
    {id: 0, proceso: 'P2', t_llegada: 1, rafaga: 1},
    {id: 0, proceso: 'P3', t_llegada: 2, rafaga: 6},
    {id: 0, proceso: 'P4', t_llegada: 2, rafaga: 10},
    {id: 0, proceso: 'P5', t_llegada: 4, rafaga: 5},
    {id: 0, proceso: 'P6', t_llegada: 5, rafaga: 15}
  ]
  arrData= [
    {id: 0, proceso: 'P1', t_llegada: 0, rafaga: 9},
    {id: 0, proceso: 'P2', t_llegada: 1, rafaga: 1},
    {id: 0, proceso: 'P3', t_llegada: 2, rafaga: 6},
    {id: 0, proceso: 'P4', t_llegada: 2, rafaga: 10},
    {id: 0, proceso: 'P5', t_llegada: 4, rafaga: 5},
    {id: 0, proceso: 'P6', t_llegada: 5, rafaga: 15}
  ]
  id = 0;
  displayedColumns: string[] = ['N°', 'Proceso', 'Tiempo de llegada', 'Ráfaga', 'eliminar'];
  displayedColumns2: string[] = ['Proceso', 'Tejec_Tlleg', 'TRProc'];
  displayedColumns3: string[] = ['Proceso', 'TFEjec_Tlleg', 'TRProc'];
  constructor(
    
  ) { }

  ngOnInit(): void {
    this.tabla = new MatTableDataSource(this.arrData);
  }

  cargatabla(data: any){
    this.tabla = new MatTableDataSource(data);
  }
  agregar(){
    if (this.val) {
      this.arrData.splice(0,1)
      this.val = false;
    }
    this.id = this.arrData.length;
    this.arrData.push({
      id: this.id,
      proceso: this.data.proceso,
      t_llegada: this.data.t_llegada,
      rafaga: this.data.rafaga
    });
    
    this.cargatabla(this.arrData)
  }

  eliminar(item: any){
    console.log(item);      
    this.arrData.splice(item.id,1)
    console.log(this.arrData);
    this.cargatabla(this.arrData)
  }

  calcular(){
    this.arrAcumulado.splice(0);
    this.arrProcesos.splice(0);
    this.arrtabla_TEP.splice(0);
    this.arrtabla_TRP.splice(0);

    this.calcular_bool = true;
    this.arrAcumulado.push(0);    
    this.arrProcesos.push( "P1" );
    let vueltas = this.arrData.length;
    const element = this.arrData[0];
      
    this.dataProceso = <any>element;      
    let RAF1 = <number>this.dataProceso?.rafaga;
    this.arrAcumulado.push(RAF1);

    for (let index = 1; index < vueltas; index++) {
      console.log("vueltas - "+ index);
      console.log(this.arrData);
      let a = this.arrAcumulado.length
      let acom = this.arrAcumulado[a-1];
      let int = this.operar(acom, this.arrData);
      this.arrData.splice(int,1);
      //console.log(this.arrProcesos);
    }
    this.calcular_promedios();
    this.tablas_promedio();
  }

  operar(acom: number, arr: any[]){
    let prioridad = 0;
    let nom_proceso = "";
    let id =  0;
    let acomAux = 0
    for (let i = 1; i < arr.length; i++) {
      const element = arr[i-1];
      const element2 = arr[i];
      this.dataProceso = <any>element;
      this.dataProcesoAux = <any>element2;

      let n_proceso = <string>this.dataProcesoAux?.proceso;
      let T_LL2 = <number>this.dataProcesoAux?.t_llegada;
      let RAF2 = <number>this.dataProcesoAux?.rafaga;

      let prioridadAux = <number>((acom-T_LL2) + 1*RAF2)/(1*RAF2)
      console.log(prioridadAux +" -- "+ n_proceso);
      
      if (prioridadAux > prioridad) {
        prioridad = prioridadAux;
        nom_proceso = n_proceso;
        acomAux = RAF2
        id = i;
      }
    }
    
    this.arrAcumulado.push(1*acom + 1*acomAux);    
    this.arrProcesos.push( nom_proceso );
    return id
  }



  calcular_promedios(){
    
    let promedio1 = 0;
    let promedio2 = 0;

    for (let index = 0; index < this.arrDataAux.length; index++) {
      const e1 = this.arrDataAux[index];
      for (let e = 0; e < this.arrProcesos.length; e++) {
        const e2 = this.arrProcesos[e];
        const tejec = this.arrAcumulado[e];
        if(e2 === e1.proceso){
          this.arrtabla_TEP.push({
            id: index,
            proceso: e1.proceso,
            tejec: tejec + " - "+ e1.t_llegada,
            tejecProc: (tejec - e1.t_llegada),
          })
          promedio1 += (tejec - e1.t_llegada)          
        }
      }
    }
    promedio1 = promedio1/6
    console.log(promedio1);
    this.arrtabla_TEP.push({
      id: 0,
      proceso: "",
      tejec: "",
      tejecProc: promedio1,
    })

    for (let index = 0; index < this.arrDataAux.length; index++) {
      const e1 = this.arrDataAux[index];
      for (let e = 0; e < this.arrProcesos.length; e++) {
        const e2 = this.arrProcesos[e];
        const tejec = this.arrAcumulado[e+1];
        if(e2 === e1.proceso){
          this.arrtabla_TRP.push({
            id: index,
            proceso: e1.proceso,
            tejec: tejec + " - "+ e1.t_llegada,
            tejecProc: (tejec - e1.t_llegada),
          })
          promedio2 += (tejec - e1.t_llegada)          
        }
      }
    }
    promedio2 = promedio2/6
    console.log(promedio2);
    this.arrtabla_TRP.push({
      id: 0,
      proceso: "",
      tejec: "",
      tejecProc: promedio2,
    })
  }


  tablas_promedio(){
    this.tabla2 = new MatTableDataSource(this.arrtabla_TEP);
    this.tabla3 = new MatTableDataSource(this.arrtabla_TRP);
  }
}
