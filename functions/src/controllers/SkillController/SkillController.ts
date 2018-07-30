interface SkillControllerInterface {
  scan(data: any): (result: any) => any;
}

export default class SkillController implements SkillControllerInterface {
  scan(data: any) {
    return (result: any) => {
      if (result.Items) {
        return {
          data: result.Items,
        };
      }
      return {
        data: [],
      };
    };
  }
}
