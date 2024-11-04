export interface Recipe{
    name: string;
    description: string;
    
}



export interface Recipedbresponse {
    recipe: Recipe[];
    Error: string;
}
