import rankUsers from './../../algorithms/rankUsers';

interface SkillControllerInterface {
  rankUsers(data: any): (result: any) => any;
}

export default class SkillController implements SkillControllerInterface {
  rankUsers(data: any) {
    return (result: any) => {
      if (result.Items) {
        return {
          ranked_users: rankUsers(result.Items),
        };
      }
      throw 'No data found inside the skills table';
    };
  }
}
