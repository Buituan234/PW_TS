function makeCake(flavor: 'chocolate' | 'vanilla', layers: number, isVegan: boolean){
    console.log(`Making a ${layers} - layers ${flavor} cake. Vega: ${isVegan}`);
}

type makeCakeType = typeof makeCake

type CakeInputs = Parameters<makeCakeType>

type flavor = CakeInputs[0]