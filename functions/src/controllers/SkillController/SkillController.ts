import rankBySkill from './../../algorithms/rankBySkill';

interface SkillControllerInterface {
  rank(data: any): (result: any) => any;
}

export default class SkillController implements SkillControllerInterface {
  rank(data: any) {
    return (result: any) => {
      if (result.Items) {
        const { rankedUsersByProject, rankedProjectsByUser } = rankBySkill(result.Items);
        return {
          ranked_users: rankedUsersByProject,
          ranked_projects: rankedProjectsByUser,
        };
      }
      throw 'No data found inside the skills table';
    };
  }
}
