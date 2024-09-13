// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable } from '@angular/core';
import { CoreContentLinksModuleIndexHandler } from '@features/contentlinks/classes/module-index-handler';
import { CoreContentLinksAction } from '@features/contentlinks/services/contentlinks-delegate';
import { CoreCourse } from '@features/course/services/course';
import { CoreLoadings } from '@services/loadings';
import { CoreDomUtils } from '@services/utils/dom';
import { makeSingleton } from '@singletons';
import { AddonModSubsection } from '../subsection';

/**
 * Handler to treat links to subsection.
 */
@Injectable({ providedIn: 'root' })
export class AddonModSubsectionIndexLinkHandlerService extends CoreContentLinksModuleIndexHandler {

    name = 'AddonModSubsectionLinkHandler';

    constructor() {
        super('AddonModSubsection', 'subsection', 'id');
    }

    /**
     * @inheritdoc
     */
    getActions(
        siteIds: string[],
        url: string,
        params: Record<string, string>,
        courseId?: number,
    ): CoreContentLinksAction[] | Promise<CoreContentLinksAction[]> {
        return [{
            action: async(siteId) => {
                const modal = await CoreLoadings.show();
                const moduleId = Number(params.id);

                try {
                    // Get the module.
                    const module = await CoreCourse.getModule(moduleId, courseId, undefined, true, false, siteId);

                    await AddonModSubsection.openSubsection(module.section, module.course, siteId);
                } catch (error) {
                    CoreDomUtils.showErrorModalDefault(error, 'Error opening link.');
                } finally {
                    modal.dismiss();
                }
            },
        }];
    }

}
export const AddonModSubsectionIndexLinkHandler = makeSingleton(AddonModSubsectionIndexLinkHandlerService);
