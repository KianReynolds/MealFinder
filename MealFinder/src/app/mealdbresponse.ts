// export interface Meal {
//   id?: string;
//   name: string;
//   category: string;
//   instructions: string;
//   ingredients: string[];
// }





export interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strIngredient1: string;
    strIngredient2: string;
    strIngredient3: string;
    strIngredient4: string;
    strIngredient5: string;
    strIngredient6: string;
    strIngredient7: string;
    strIngredient8: string;
    strIngredient9: string;
  }
  
  export interface themealdbResponse {
    meals: Meal[];
    Error:string;
  }
  